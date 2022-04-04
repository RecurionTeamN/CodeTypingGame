import React, { useState } from "react";
import { makeStyles } from "@mui/styles";
import { ToggleButton, ToggleButtonGroup, Box, Card } from "@mui/material";
import { KeyData } from "../../data/keyboardData";
import Keyboard from "../../components/Keyboard";

type Props = {
  data: KeyData;
  keyboardType: "jis" | "us" | "mac-jis" | "mac-us";
};

type Color = {
  [keyName: string]: string;
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
    alignItems: "start",
  },
  rowFlexEnd: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "end",
  },
  keyboardContainer: {
    width: "70%",
  },
}));

const KeyStatistics: React.VFC<Props> = ({ data, keyboardType }) => {
  const classes = useStyles();

  const calcEachKeyValue = (initialData: KeyData) => {
    const calcData = initialData;
    Object.keys(initialData).forEach((keyName) => {
      const pushCount = initialData[keyName].pushCount ?? 0;
      const missCount = initialData[keyName].missCount ?? 0;
      const timeSecCount = initialData[keyName].timeSecCount ?? 0;
      calcData[keyName].accuracy = pushCount !== 0 ? Math.floor((pushCount / (pushCount + missCount)) * 100) : 0;
      calcData[keyName].speed = pushCount !== 0 ? Math.floor(pushCount / (timeSecCount / 60)) : 0;
    });
    return calcData;
  };

  const calcEachKeyButtonColor = (calcData: KeyData) => {
    const keyArr = Object.keys(calcData);
    const colorMap: { [key in "speed" | "accuracy"]: Color } = { speed: {}, accuracy: {} };
    keyArr
      .filter((keyName) => calcData[keyName].keyType === "default")
      .forEach((keyName) => {
        const speedArr = calcData[keyName].speed !== 0 ? [calcData[keyName].speed as number] : [];
        const accuracyArr = calcData[keyName].accuracy !== 0 ? [calcData[keyName].accuracy as number] : [];
        keyArr
          .filter(
            (k) =>
              calcData[k].keyType !== "default" &&
              calcData[k].accuracy !== 0 &&
              calcData[keyName].position[0] === calcData[k].position[0] &&
              calcData[keyName].position[1] === calcData[k].position[1]
          )
          .forEach((k) => {
            speedArr.push(calcData[k].speed as number);
            accuracyArr.push(calcData[k].accuracy as number);
          });
        const avgSpeed =
          speedArr.length === 0
            ? 0
            : speedArr.reduce((previousValue, currentValue) => previousValue + currentValue) / speedArr.length;
        const avgAccuracy =
          accuracyArr.length === 0
            ? 0
            : accuracyArr.reduce((previousValue, currentValue) => previousValue + currentValue) / accuracyArr.length;

        if (avgSpeed <= 0) colorMap.speed[keyName] = "#FFFFFF";
        else if (avgSpeed >= 200) colorMap.speed[keyName] = "#0000FF";
        else if (avgSpeed >= 150) colorMap.speed[keyName] = "#0099FF";
        else if (avgSpeed >= 100) colorMap.speed[keyName] = "#00CCFF";
        else if (avgSpeed >= 50) colorMap.speed[keyName] = "#00FFFF";
        else colorMap.speed[keyName] = "#CCFFFF";

        if (avgAccuracy <= 0) colorMap.accuracy[keyName] = "#FFFFFF";
        else if (avgAccuracy >= 95) colorMap.accuracy[keyName] = "#0000FF";
        else if (avgAccuracy >= 90) colorMap.accuracy[keyName] = "#0099FF";
        else if (avgAccuracy >= 80) colorMap.accuracy[keyName] = "#00CCFF";
        else if (avgAccuracy >= 70) colorMap.accuracy[keyName] = "#00FFFF";
        else colorMap.accuracy[keyName] = "#CCFFFF";
      });
    return colorMap;
  };

  const keyData = calcEachKeyValue(data);
  const colorMap = calcEachKeyButtonColor(keyData);
  const [showMode, setShowMode] = useState<"speed" | "accuracy">("speed");
  const [detailKeyArr, setDetailKeyArr] = useState<string[]>([]);
  const toggleShowMode = (event: React.MouseEvent<HTMLElement>, newMode: "speed" | "accuracy") => {
    setShowMode(newMode);
  };
  const handleDetailKeyArr = (keyName: string) => {
    const keyArr = [];
    keyArr.push(keyName);
    const anotherKeys = Object.keys(data).filter(
      (k) =>
        data[k].keyType !== "default" &&
        data[keyName].position[0] === data[k].position[0] &&
        data[keyName].position[1] === data[k].position[1]
    );
    if (anotherKeys.length !== 0) anotherKeys.forEach((anotherKey) => keyArr.push(anotherKey));
    setDetailKeyArr(keyArr);
  };

  const statistics = Object.keys(keyData).map((keyName) => {
    const { speed, accuracy, pushCount, missCount, timeSecCount } = keyData[keyName];
    if (detailKeyArr.includes(keyName)) {
      if (Number.isNaN(accuracy) || accuracy === 0)
        return (
          <div key={keyName}>
            <strong>Key[ {keyName} ]</strong>
            <br />
            No Data
            <br />
            <br />
          </div>
        );
      return (
        <div key={keyName}>
          <strong>Key[ {keyName} ]</strong>
          <br />
          精度:{accuracy}%, 速さ:{speed}kpm,
          <br />
          正解回数:{pushCount}回, ミス回数: {missCount ?? 0}回,
          <br />
          平均経過時間: {Math.floor((1000 * (timeSecCount ?? 0)) / (pushCount ?? 0)) / 1000}秒,
          <br />
          <br />
        </div>
      );
    }
    return null;
  });

  // 後々にキーボードのコンポーネントを作成して、キー毎の統計を見やすいデザインとする。
  return (
    <div className={classes.container}>
      <div className={classes.rowFlex}>
        <h2>Keybord Master(キー毎の統計情報)</h2>
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
      <br />
      <div className={classes.rowFlex}>
        <Card sx={{ paddingX: 2 }}>
          <h4>キーボタンを押して詳細情報を表示</h4>
          {statistics}
        </Card>
        <div className={classes.keyboardContainer}>
          <Keyboard color={colorMap[showMode]} keyboardType={keyboardType} onClick={handleDetailKeyArr} />
        </div>
      </div>
    </div>
  );
};

export default KeyStatistics;
