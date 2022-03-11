import React from "react";
import Box from "@mui/material/Box";

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
  // Object.keys()の返り値がstring型になるので型アサーションを使用する
  const fingerData: {
    [key1 in Hand]: {
      [key2 in Finger]: { pushCountSum: number; missCountSum: number; timeSecSum: number };
    };
  } = {
    left: {
      thumb: { pushCountSum: 0, missCountSum: 0, timeSecSum: 0 },
      first: { pushCountSum: 0, missCountSum: 0, timeSecSum: 0 },
      second: { pushCountSum: 0, missCountSum: 0, timeSecSum: 0 },
      third: { pushCountSum: 0, missCountSum: 0, timeSecSum: 0 },
      fourth: { pushCountSum: 0, missCountSum: 0, timeSecSum: 0 },
    },
    right: {
      thumb: { pushCountSum: 0, missCountSum: 0, timeSecSum: 0 },
      first: { pushCountSum: 0, missCountSum: 0, timeSecSum: 0 },
      second: { pushCountSum: 0, missCountSum: 0, timeSecSum: 0 },
      third: { pushCountSum: 0, missCountSum: 0, timeSecSum: 0 },
      fourth: { pushCountSum: 0, missCountSum: 0, timeSecSum: 0 },
    },
  };
  data.forEach((element) => {
    fingerData[element.hand][element.finger].pushCountSum += element.pushCount;
    fingerData[element.hand][element.finger].missCountSum += element.missCount;
    fingerData[element.hand][element.finger].timeSecSum += element.timeSecCount;
  });
  // 指ごとの統計情報を表示する
  // 指ごとの統計情報に親指は不要なので各手の指配列をfilter()する
  const statistics = (Object.keys(fingerData) as Hand[]).map((hand) => {
    const eachHandResults = (Object.keys(fingerData[hand]) as Finger[])
      .filter((finger) => finger !== "thumb")
      .map((finger) => {
        const currFinData = fingerData[hand][finger];
        const accuracy = Math.floor(
          ((currFinData.pushCountSum - currFinData.missCountSum) / currFinData.pushCountSum) * 100
        );
        const speed = (currFinData.pushCountSum - currFinData.missCountSum) / (currFinData.timeSecSum / 60);
        return (
          <div>
            <p>
              {finger}: {accuracy}%, {speed}wpm
            </p>
          </div>
        );
      });
    return (
      <div>
        <h4>{hand}</h4>
        {eachHandResults}
      </div>
    );
  });

  // 後々に手のコンポーネントを作成して、指毎の統計を見やすいデザインとする。
  return (
    <div>
      <h3>Finger Master</h3>
      <p>*指毎の統計情報表示をこれから詳細に開発する。以下は現在の例</p>
      <Box sx={{ display: "flex", justifyContent: "space-evenly" }}>{statistics}</Box>
    </div>
  );
};

export default FingerStatistics;
