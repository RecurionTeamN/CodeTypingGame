import React from "react";
import Box from "@mui/material/Box";
import ResultPageHeader from "./DashboardPageHeader";
import BestScores from "../../components/BestScores";
import Heatmap from "./Heatmap";

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

const DashboardPage = () => (
  <div>
    <ResultPageHeader />
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Box sx={{ display: "flex", flexDirection: "col", justifyContent: "space-evenly" }}>
        <BestScores data={dummyBestScores} />
      </Box>

      <p style={{ fontSize: "50px", color: "red" }}>To be updated</p>
      <Box sx={{ display: "flex", flexDirection: "col", justifyContent: "center", paddingTop: "20px" }}>
        <Heatmap />
      </Box>
    </Box>
  </div>
);

export default DashboardPage;
