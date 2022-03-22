import React from "react";
import Box from "@mui/material/Box";
import HandSVG from "../../components/HandSVG";

type Hand = "left" | "right";

type Finger = "thumb" | "first" | "second" | "third" | "fourth";

type KeyData = {
  keyName: string;
  hand: Hand;
  finger: Finger;
  pushCount: number;
  missCount: number;
  timeSecCount: number;
};

type Props = {
  data: KeyData[];
};

const FingerStatistics: React.VFC<Props> = ({ data }) => {
  // キー毎の情報を指ごとの情報に変換する
  const fingerData: {
    [key1 in Hand]: {
      [key2 in Finger]: { pushCountSum: number; missCountSum: number; timeSecSum: number; color: string };
    };
  } = {
    left: {
      thumb: { pushCountSum: 0, missCountSum: 0, timeSecSum: 0, color: "#fff" },
      first: { pushCountSum: 0, missCountSum: 0, timeSecSum: 0, color: "#fff" },
      second: { pushCountSum: 0, missCountSum: 0, timeSecSum: 0, color: "#fff" },
      third: { pushCountSum: 0, missCountSum: 0, timeSecSum: 0, color: "#fff" },
      fourth: { pushCountSum: 0, missCountSum: 0, timeSecSum: 0, color: "#fff" },
    },
    right: {
      thumb: { pushCountSum: 0, missCountSum: 0, timeSecSum: 0, color: "#fff" },
      first: { pushCountSum: 0, missCountSum: 0, timeSecSum: 0, color: "#fff" },
      second: { pushCountSum: 0, missCountSum: 0, timeSecSum: 0, color: "#fff" },
      third: { pushCountSum: 0, missCountSum: 0, timeSecSum: 0, color: "#fff" },
      fourth: { pushCountSum: 0, missCountSum: 0, timeSecSum: 0, color: "#fff" },
    },
  };
  data.forEach((element) => {
    fingerData[element.hand][element.finger].pushCountSum += element.pushCount;
    fingerData[element.hand][element.finger].missCountSum += element.missCount;
    fingerData[element.hand][element.finger].timeSecSum += element.timeSecCount;
  });
  // 指ごとの統計情報を表示する
  // 指ごとの統計情報に親指は不要なので各手の指配列をfilter()する
  // Object.keys()の返り値がstring型になるので型アサーションを使用する
  const statistics = (Object.keys(fingerData) as Hand[]).map((hand) => {
    const fingerArr = Object.keys(fingerData[hand]) as Finger[];
    if (hand === "left") fingerArr.reverse();
    const eachHandResults = fingerArr
      .filter((finger) => finger !== "thumb")
      .map((finger) => {
        const currFinData = fingerData[hand][finger];
        const accuracy = Math.floor(
          ((currFinData.pushCountSum - currFinData.missCountSum) / currFinData.pushCountSum) * 100
        );
        const speed = (currFinData.pushCountSum - currFinData.missCountSum) / (currFinData.timeSecSum / 60);

        if (speed >= 80) fingerData[hand][finger].color = "#0000FF";
        else if (speed >= 60) fingerData[hand][finger].color = "#0099FF";
        else if (speed >= 40) fingerData[hand][finger].color = "#00CCFF";
        else if (speed >= 20) fingerData[hand][finger].color = "#00FFFF";
        else fingerData[hand][finger].color = "#CCFFFF";

        return (
          <Box key={finger} sx={{ px: 2 }}>
            {finger} <br />
            {accuracy}% <br />
            {speed}wpm <br />
          </Box>
        );
      });

    return (
      <div key={hand}>
        <h4>{hand} fingers</h4>
        <HandSVG
          hand={hand}
          firstColor={fingerData[hand].first.color}
          secondColor={fingerData[hand].second.color}
          thirdColor={fingerData[hand].third.color}
          fourthColor={fingerData[hand].fourth.color}
        />
        <Box sx={{ display: "flex", justifyContent: "space-evenly" }}>{eachHandResults}</Box>
      </div>
    );
  });

  // 後々に手のコンポーネントを作成して、指毎の統計を見やすいデザインとする。
  return (
    <div>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <h3>Finger Master</h3>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <p>slow</p>
          <Box
            sx={{
              width: 20,
              height: 20,
              bgcolor: "#CCFFFF",
              m: 1,
            }}
          />
          <Box
            sx={{
              width: 20,
              height: 20,
              bgcolor: "#00FFFF",
              m: 1,
            }}
          />
          <Box
            sx={{
              width: 20,
              height: 20,
              bgcolor: "#00CCFF",
              m: 1,
            }}
          />
          <Box
            sx={{
              width: 20,
              height: 20,
              bgcolor: "#0099FF",
              m: 1,
            }}
          />
          <Box
            sx={{
              width: 20,
              height: 20,
              bgcolor: "#0000FF",
              m: 1,
            }}
          />
          <p>fast</p>
        </Box>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>{statistics}</Box>
    </div>
  );
};

export default FingerStatistics;
