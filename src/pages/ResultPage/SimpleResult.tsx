import React from "react";
import { Box } from "@mui/material";
import DoughnutChartResult from "../../components/DoughnutChartResult";
import CodeLanguageIcon from "../../components/CodeLanguageIcon";
import { CodeLangTypes } from "../../context/profile/types";

type Props = {
  language: string;
  accuracy: number;
  speed: number;
};

const SimpleResult: React.VFC<Props> = ({ language, accuracy, speed }) => (
  <div>
    <div style={{ display: "flex", alignItems: "center" }}>
      <span style={{ paddingRight: "10px" }}>
        <CodeLanguageIcon codeLanguage={language as CodeLangTypes} size={40} />
      </span>
      <h2> {language}</h2>
    </div>
    <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
      <DoughnutChartResult type="accuracy" value={accuracy} />
      <DoughnutChartResult type="speed" value={speed} />
    </Box>
    <p>※速度の単位kpmとは1分あたりのタイピング数(keystrokes per minute)を表します。</p>
  </div>
);

export default SimpleResult;
