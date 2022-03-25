import React from "react";
import Box from "@mui/material/Box";
import ResultPageHeader from "./ResultPageHeader";
import SimpleResult from "./SimpleResult";
import BestScores from "../../components/BestScores";
import KeyStatistics from "./KeyStatistics";
import FingerStatistcs from "./FingerStatistics";
import { KeyData } from "../../data/keyboardData";

// 子コンポーネントで使用する予定のデータ（現状はダミー）とその型

type Props = {
  language: string;
  gameData: {
    speed: number;
    accuracy: number;
    keyData: KeyData;
  };
  bestScores: {
    [langName: string]: {
      speed: number;
      accuracy: number;
    };
  };
};

// ダミーデータを渡して、子コンポーネントでpropsが上手く処理されることを確認する。
const ResultPage: React.FC<Props> = ({ language, gameData, bestScores }) => (
  <div>
    <ResultPageHeader />
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly" }}>
        <SimpleResult language={language} accuracy={gameData.accuracy} speed={gameData.speed} />
        <BestScores data={bestScores} />
      </Box>
      <KeyStatistics data={gameData.keyData} />
      <FingerStatistcs data={gameData.keyData} />
    </Box>
  </div>
);

export default ResultPage;
