import React, { useState } from "react";
import { makeStyles } from "@mui/styles";
import { ToggleButton, ToggleButtonGroup, Box, Card } from "@mui/material";
import { KeyData } from "../../data/keyboardData";
import Keyboard from "../../components/NewKeyboard";

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
      calcData[keyName].accuracy = Math.floor(((pushCount - missCount) / pushCount) * 100);
      calcData[keyName].speed = Math.floor((pushCount - missCount) / (timeSecCount / 60));
    });
    return calcData;
  };

  const calcEachKeyButtonColor = (calcData: KeyData) => {
    const usedKeyArr = Object.keys(calcData).filter((keyName) => !Number.isNaN(calcData[keyName].accuracy));
    const colorMap: { [key in "speed" | "accuracy"]: Color } = { speed: {}, accuracy: {} };
    usedKeyArr
      .filter((keyName) => calcData[keyName].keyType === "default")
      .forEach((keyName) => {
        const speedArr = [calcData[keyName].speed as number];
        const accuracyArr = [calcData[keyName].accuracy as number];
        usedKeyArr
          .filter(
            (k) =>
              calcData[k].keyType !== "default" &&
              calcData[keyName].position[0] === calcData[k].position[0] &&
              calcData[keyName].position[1] === calcData[k].position[1]
          )
          .forEach((k) => {
            speedArr.push(calcData[k].speed as number);
            accuracyArr.push(calcData[k].accuracy as number);
          });
        const avgSpeed =
          speedArr.reduce((previousValue, currentValue) => previousValue + currentValue) / speedArr.length;
        const avgAccuracy =
          accuracyArr.reduce((previousValue, currentValue) => previousValue + currentValue) / accuracyArr.length;

        if (avgSpeed >= 200) colorMap.speed[keyName] = "#0000FF";
        else if (avgSpeed >= 150) colorMap.speed[keyName] = "#0099FF";
        else if (avgSpeed >= 100) colorMap.speed[keyName] = "#00CCFF";
        else if (avgSpeed >= 50) colorMap.speed[keyName] = "#00FFFF";
        else colorMap.speed[keyName] = "#CCFFFF";

        if (avgAccuracy >= 95) colorMap.accuracy[keyName] = "#0000FF";
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
    const anotherKey = Object.keys(data).find(
      (k) =>
        data[k].keyType !== "default" &&
        data[keyName].position[0] === data[k].position[0] &&
        data[keyName].position[1] === data[k].position[1]
    );
    if (anotherKey !== undefined) keyArr.push(anotherKey);
    setDetailKeyArr(keyArr);
  };

  const statistics = Object.keys(keyData).map((keyName) => {
    const { speed, accuracy, pushCount, missCount, timeSecCount } = keyData[keyName];
    if (detailKeyArr.includes(keyName)) {
      if (Number.isNaN(accuracy))
        return (
          <div key={keyName}>
            <strong>Key[{keyName}]</strong>
            <br />
            No Data
            <br />
            <br />
          </div>
        );
      return (
        <div key={keyName}>
          <strong>Key[{keyName}]</strong>
          <br />
          精度:{accuracy}%, 速さ:{speed}kpm,
          <br />
          押した回数:{pushCount}回, ミスした回数: {missCount ?? 0}回,
          <br />
          総経過時間: {timeSecCount}秒,
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
          <p>{showMode === "speed" ? "早い" : "正確"}</p>
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
