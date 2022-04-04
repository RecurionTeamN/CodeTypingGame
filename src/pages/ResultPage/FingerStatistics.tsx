import React, { useState } from "react";
import { makeStyles } from "@mui/styles";
import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import HandSVG from "../../components/HandSVG";
import { KeyData } from "../../data/keyboardData";

type Hand = "left" | "right";

type Finger = "thumb" | "first" | "second" | "third" | "fourth";

type Props = {
  data: KeyData;
};

const useStyles = makeStyles(() => ({
  container: {
    width: "90%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  rowFlex: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rowFlexCenter: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  rowFlexEnd: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "end",
  },
}));

const FingerStatistics: React.VFC<Props> = ({ data }) => {
  const classes = useStyles();
  const [showMode, setShowMode] = useState<"speed" | "accuracy">("speed");
  const toggleShowMode = (event: React.MouseEvent<HTMLElement>, newMode: "speed" | "accuracy") => {
    setShowMode(newMode);
  };
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
          (currFinData.pushCountSum / (currFinData.pushCountSum + currFinData.missCountSum)) * 100
        );
        const speed = Math.floor(currFinData.pushCountSum / (currFinData.timeSecSum / 60));

        if (showMode === "speed") {
          if (Number.isNaN(speed)) fingerData[hand][finger].color = "#e6e6e6";
          else if (speed >= 200) fingerData[hand][finger].color = "#0000FF";
          else if (speed >= 150) fingerData[hand][finger].color = "#0099FF";
          else if (speed >= 100) fingerData[hand][finger].color = "#00CCFF";
          else if (speed >= 50) fingerData[hand][finger].color = "#00FFFF";
          else fingerData[hand][finger].color = "#CCFFFF";
        } else if (Number.isNaN(accuracy)) fingerData[hand][finger].color = "#e6e6e6";
        else if (accuracy >= 95) fingerData[hand][finger].color = "#0000FF";
        else if (accuracy >= 90) fingerData[hand][finger].color = "#0099FF";
        else if (accuracy >= 80) fingerData[hand][finger].color = "#00CCFF";
        else if (accuracy >= 70) fingerData[hand][finger].color = "#00FFFF";
        else fingerData[hand][finger].color = "#CCFFFF";

        let fingerText = "";
        switch (finger) {
          case "first":
            fingerText = "人差し指";
            break;
          case "second":
            fingerText = "中指";
            break;
          case "third":
            fingerText = "薬指";
            break;
          case "fourth":
            fingerText = "小指";
            break;
          default:
        }

        return (
          <Box key={finger} sx={{ px: 2 }}>
            {fingerText} <br />
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
        <h4>{hand === "left" ? "左手" : "右手"}</h4>
        <HandSVG hand={hand} color={color} />
        <Box sx={{ display: "flex", justifyContent: "space-evenly" }}>{eachHandResults}</Box>
      </div>
    );
  });

  // 後々に手のコンポーネントを作成して、指毎の統計を見やすいデザインとする。
  return (
    <div className={classes.container}>
      <div className={classes.rowFlex}>
        <h2>Finger Master(指毎の統計情報)</h2>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <p>{showMode === "speed" ? "遅い" : "不正確"}</p>
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
          <p>{showMode === "speed" ? "速い" : "正確"}</p>
        </Box>
      </div>
      <div className={classes.rowFlexEnd}>
        <ToggleButtonGroup exclusive value={showMode} onChange={toggleShowMode}>
          <ToggleButton value="speed" aria-label="speed result">
            速さ
          </ToggleButton>
          <ToggleButton value="accuracy" aria-label="accuracy result">
            正確性
          </ToggleButton>
        </ToggleButtonGroup>
      </div>
      <div className={classes.rowFlexCenter}>{statistics}</div>
      <br />
    </div>
  );
};

export default FingerStatistics;
