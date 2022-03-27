import React from "react";
import Box from "@mui/material/Box";
import HandSVG from "../../components/HandSVG";
import { KeyData } from "../../data/keyboardData";

type Hand = "left" | "right";

type Finger = "thumb" | "first" | "second" | "third" | "fourth";

type Props = {
  data: KeyData;
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
  (Object.keys(data) as (keyof typeof data)[]).forEach((keyName) => {
    const keyData = data[keyName];
    fingerData[keyData.hand][keyData.finger].pushCountSum += keyData.pushCount ?? 0;
    fingerData[keyData.hand][keyData.finger].missCountSum += keyData.missCount ?? 0;
    fingerData[keyData.hand][keyData.finger].timeSecSum += keyData.timeSecCount ?? 0;
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
        const speed = Math.floor((currFinData.pushCountSum - currFinData.missCountSum) / (currFinData.timeSecSum / 60));

        // 使用されていない指の値はNaNになるため、条件分岐で色をつけない。
        if (Number.isNaN(speed)) fingerData[hand][finger].color = "#e6e6e6";
        else if (speed >= 200) fingerData[hand][finger].color = "#0000FF";
        else if (speed >= 150) fingerData[hand][finger].color = "#0099FF";
        else if (speed >= 100) fingerData[hand][finger].color = "#00CCFF";
        else if (speed >= 50) fingerData[hand][finger].color = "#00FFFF";
        else fingerData[hand][finger].color = "#CCFFFF";

        return (
          <Box key={finger} sx={{ px: 2 }}>
            {finger} <br />
            {Number.isNaN(accuracy) ? "-" : accuracy}% <br />
            {Number.isNaN(speed) ? "-" : speed}kpm <br />
          </Box>
        );
      });
    const color = {
      first: fingerData[hand].first.color,
      second: fingerData[hand].second.color,
      third: fingerData[hand].third.color,
      fourth: fingerData[hand].fourth.color,
    };
    return (
      <div key={hand}>
        <h4>{hand} fingers</h4>
        <HandSVG hand={hand} color={color} />
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
