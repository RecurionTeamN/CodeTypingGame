import React from "react";
import Box from "@mui/material/Box";
import SimpleResult from "./SimpleResult";
import KeyStatistics from "./KeyStatistics";
import FingerStatistcs from "./FingerStatistics";
import { KeyData } from "../../data/keyboardData";
import useProfileContext from "../../hooks/useProfileContext";
import Header from "../../components/Header";
import ResultTable from "../DashboardPage/ResultTable";

// 子コンポーネントで使用する予定のデータ（現状はダミー）とその型

type Props = {
  currGameData: {
    speed: number;
    accuracy: number;
    keyData: KeyData;
  };
};

// ダミーデータを渡して、子コンポーネントでpropsが上手く処理されることを確認する。
const ResultPage: React.FC<Props> = ({ currGameData }) => {
  const { profileState } = useProfileContext();
  const { userSettings } = profileState;

  return (
    <div>
      <Header />
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "start",
            width: "90%",
          }}
        >
          <SimpleResult language={userSettings.codeLang} accuracy={currGameData.accuracy} speed={currGameData.speed} />
          <div style={{ width: "50%" }}>
            <h2>BestScores</h2>
            <ResultTable tableHeight={270} />
          </div>
        </Box>
        <br />
        <hr style={{ width: "90%" }} />
        <KeyStatistics keyboardType={userSettings.keyboardType} data={currGameData.keyData} />
        <br />
        <hr style={{ width: "90%" }} />
        <FingerStatistcs data={currGameData.keyData} />
      </Box>
    </div>
  );
};

export default ResultPage;
