import React from "react";
import Box from "@mui/material/Box";
import ResultPageHeader from "../components/ResultPageHeader";
import SimpleResult from "../components/SimpleResult";
import BestScores from "../components/BestScores";
import KeyStatistics from "../components/KeyStatistics";
import FingerStatistcs from "../components/FingerStatistics";

// 子コンポーネントで使用する予定のデータ（現状はダミー）とその型
type Result = {
  language: string;
  accuracy: number;
  speed: number;
  detailtData: KeyData[];
};

type KeyData = {
  keyName: string;
  hand: Hand;
  finger: Finger;
  pushCount: number;
  missCount: number;
  timeSecCount: number;
};

type Hand = "left" | "right";
type Finger = "thumb" | "first" | "second" | "third" | "fourth";

const dummyResult: Result = {
  language: "Python",
  accuracy: 90,
  speed: 54,
  detailtData: [
    { keyName: "a", hand: "left", finger: "fourth", pushCount: 10, missCount: 2, timeSecCount: 10 },
    { keyName: "s", hand: "left", finger: "third", pushCount: 20, missCount: 3, timeSecCount: 20 },
    { keyName: "d", hand: "left", finger: "second", pushCount: 30, missCount: 4, timeSecCount: 30 },
    { keyName: "f", hand: "left", finger: "first", pushCount: 40, missCount: 3, timeSecCount: 40 },
    { keyName: "j", hand: "right", finger: "first", pushCount: 10, missCount: 0, timeSecCount: 10 },
    { keyName: "k", hand: "right", finger: "second", pushCount: 20, missCount: 1, timeSecCount: 20 },
    { keyName: "l", hand: "right", finger: "third", pushCount: 30, missCount: 2, timeSecCount: 30 },
    { keyName: ";", hand: "right", finger: "fourth", pushCount: 40, missCount: 5, timeSecCount: 40 },
    { keyName: "space", hand: "left", finger: "thumb", pushCount: 40, missCount: 4, timeSecCount: 40 },
  ],
};

type Best = {
  language: string;
  accuracy: number;
  speed: number;
};

const dummyBestScores: Best[] = [
  { language: "Python", accuracy: 80, speed: 30 },
  { language: "Java", accuracy: 75, speed: 45 },
  { language: "JavaScript", accuracy: 85, speed: 35 },
  { language: "PHP", accuracy: 90, speed: 30 },
  { language: "TypeScript", accuracy: 99, speed: 50 },
];

// ダミーデータを渡して、子コンポーネントでpropsが上手く処理されることを確認する。
const ResultPage = () => (
  <div>
    <ResultPageHeader />
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly" }}>
        <SimpleResult language={dummyResult.language} accuracy={dummyResult.accuracy} speed={dummyResult.speed} />
        <BestScores data={dummyBestScores} />
      </Box>
      <KeyStatistics data={dummyResult.detailtData} />
      <FingerStatistcs data={dummyResult.detailtData} />
    </Box>
  </div>
);

export default ResultPage;
export type { Result, KeyData, Hand, Finger, Best };
