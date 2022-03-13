import React from "react";
import { Box } from "@mui/material";
import DoughnutChartResult from "./DoughnutChartResult";

type Props = {
  language: string;
  accuracy: number;
  speed: number;
};

const SimpleResult: React.VFC<Props> = ({ language, accuracy, speed }) => (
  <div>
    <h3>Result({language})</h3>
    <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
      <DoughnutChartResult type="accuracy" value={accuracy} />
      <DoughnutChartResult type="speed" value={speed} />
    </Box>
  </div>
);

export default SimpleResult;
