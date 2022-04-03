import React from "react";
import { Box } from "@mui/material";
import DoughnutChartResult from "../../components/DoughnutChartResult";

type Props = {
  language: string;
  accuracy: number;
  speed: number;
};

const SimpleResult: React.VFC<Props> = ({ language, accuracy, speed }) => (
  <div>
    <h2>Result({language})</h2>
    <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
      <DoughnutChartResult type="accuracy" value={accuracy} />
      <DoughnutChartResult type="speed" value={speed} />
    </Box>
  </div>
);

export default SimpleResult;
