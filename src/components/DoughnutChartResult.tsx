import React from "react";
import { Box } from "@mui/material";
import "chartjs-plugin-doughnutlabel";
import { Doughnut } from "react-chartjs-2";
import theme from "../styles/Theme";

type Props = {
  type: "accuracy" | "speed";
  value: number;
};
// Accuracy（精度）の表示では100％を最大、Speed（早さ）の表示では現状は200kpmを最大とする。
const DoughnutChartResult: React.VFC<Props> = ({ type, value }) => {
  // ドーナツチャートに表示するため、色付き部分（ゲーム結果の値）と白抜き部分の数値をfixedValuesに入れる。
  let fixedValues: number[] = [];
  let unit = "";
  if (type === "accuracy") {
    fixedValues = [value, 100 - value];
    unit = "%";
  } else if (type === "speed") {
    fixedValues = value <= 200 ? [value, 200 - value] : [200, 0];
    unit = "kpm";
  }
  const graphdata = {
    datasets: [
      {
        data: fixedValues,
        backgroundColor: [type === "accuracy" ? theme.palette.success.light : theme.palette.primary.main, "white"],
      },
    ],
    labels: ["score", "max-score"],
  };
  // チャートの中央部分に文字列を表示するためのoptions
  const doughnutOptions = {
    legend: {
      display: false,
    },
    cutoutPercentage: 70,
    plugins: {
      doughnutlabel: {
        labels: [
          {
            text: value,
            color: "#666666",
            font: {
              size: 30,
            },
          },
          {
            text: unit,
            color: "#888888",
          },
        ],
      },
    },
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Doughnut data={graphdata} options={doughnutOptions} />
      <p>{type === "accuracy" ? "精度 (%)" : "速度 (kpm)"}</p>
    </Box>
  );
};

export default DoughnutChartResult;
