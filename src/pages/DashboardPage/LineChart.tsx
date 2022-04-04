import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { makeStyles } from "@mui/styles";
import { Card, CardContent, Box, FormControl, Select, MenuItem } from "@mui/material";
import { GameHistoryDocument } from "../../firebase/GameHistory/types";
import { codeLangs, CodeLangTypes } from "../../context/profile/types";
import useProfileContext from "../../hooks/useProfileContext";
import theme from "../../styles/Theme";
import CodeLanguageIcon from "../../components/CodeLanguageIcon";

const useStyles = makeStyles(() => ({
  card: {
    padding: "10px 10px",
    borderRadius: "25px",
  },
}));

type Props = {
  gameHistory: GameHistoryDocument[] | undefined;
};

type Values = {
  data: {
    speedData: number[];
    accuracyData: number[];
  };
  labels: number[];
};

const LineChart: React.VFC<Props> = ({ gameHistory }) => {
  const classes = useStyles();
  const { profileState } = useProfileContext();
  const gameHistoryData = new Map<CodeLangTypes, Values>();

  if (gameHistory) {
    codeLangs.forEach((codeLang) => {
      const currData = gameHistory
        .filter((currGameHistory) => currGameHistory.codeLang === codeLang)
        .sort((a, b) => a.createdAt.toDate().getTime() - b.createdAt.toDate().getTime());

      let speedData: number[] = [];
      let accuracyData: number[] = [];

      if (currData) {
        speedData = currData.map((data) => data.speed);
        accuracyData = currData.map((data) => data.accuracy);
      }

      const labels = Array.from({ length: currData.length }, (_, index) => index + 1).slice(-20);
      speedData = speedData.slice(-20);
      accuracyData = accuracyData.slice(-20);

      gameHistoryData.set(codeLang, {
        data: {
          accuracyData,
          speedData,
        },
        labels,
      });
    });
  }

  const [codeLanguage, setCodeLanguage] = useState<CodeLangTypes>(profileState.userSettings.codeLang);

  useEffect(() => {
    setCodeLanguage(profileState.userSettings.codeLang);
  }, [profileState.userSettings.codeLang]);

  const graphData = {
    type: "line",
    labels: gameHistoryData.get(codeLanguage)?.labels,
    datasets: [
      {
        label: "精度 (%)",
        data: gameHistoryData.get(codeLanguage)?.data.accuracyData,
        yAxisID: "accuracy",
        borderColor: theme.palette.success.light,
        fill: false,
      },
      {
        label: "速度 (kpm)",
        data: gameHistoryData.get(codeLanguage)?.data.speedData,
        yAxisID: "speed",
        borderColor: theme.palette.primary.main,
        fill: false,
      },
    ],
  };

  const graphOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    stacked: false,
    animation: {
      ease: "easeInOut",
      duration: 1000,
    },
    scales: {
      yAxes: [
        {
          id: "speed",
          type: "linear",
          position: "left",
          scaleLabel: {
            display: true,
            labelString: "速度 (kpm)",
          },
        },
        {
          id: "accuracy",
          scaleLabel: {
            display: true,
            labelString: "精度 (%)",
          },
          type: "linear",
          position: "right",
          ticks: {
            max: 100,
            min: 0,
          },
        },
      ],
    },
  };

  return (
    <Card className={classes.card} variant="outlined">
      <Box width="100%" sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
        <span style={{ paddingRight: "10px" }}>
          <CodeLanguageIcon codeLanguage={codeLanguage} size={25} />
        </span>
        <FormControl variant="standard" size="small" hiddenLabel sx={{ width: "100px", paddingRight: "30px" }}>
          <Select id="select" value={codeLanguage} onChange={(e) => setCodeLanguage(e.target.value as CodeLangTypes)}>
            {codeLangs.map((codeLang) => (
              <MenuItem key={codeLang} value={codeLang}>
                {codeLang}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <CardContent sx={{ paddingTop: 0 }}>
        <Line height={250} data={graphData} options={graphOptions} />
      </CardContent>
    </Card>
  );
};

export default LineChart;
