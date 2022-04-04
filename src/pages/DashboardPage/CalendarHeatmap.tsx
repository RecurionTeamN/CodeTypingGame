import React, { useEffect, useRef } from "react";
import { makeStyles } from "@mui/styles";
import * as d3 from "d3";
import { GameHistoryDocument } from "../../firebase/GameHistory/types";
import theme from "../../styles/Theme";

type CalendarHeatmapProps = {
  gameHistoryDocuments: GameHistoryDocument[];
  currentYear: number;
  currentMonth: number;
  width: number;
};

type Dailydata = {
  month: number;
  dayofweek: number;
  weekOfMonth: number;
  day: number;
  times: number;
};

const useStyles = makeStyles(() => ({
  tooltip: {
    position: "absolute",
    border: "solid",
    borderWidth: "2px",
    borderRadius: "3px",
    padding: "0.5rem",
    fontSize: "0.8rem",
    color: "black",
    backgroundColor: "white",
    textAlign: "center",
    visibility: "hidden",
  },
  heatmapLabel: {
    color: "gray",
    textAlign: "center",
    padding: 0,
    margin: 0,
  },
}));

// 該当年月の日別プレイ情報を設定する関数
const generateDailyHistory = (
  gameHistoryDocuments: GameHistoryDocument[],
  currentYear: number,
  currentMonth: number
): Dailydata[] => {
  const dailyHistory: Dailydata[] = [];

  // 日付を該当年月の月初に設定
  const date = new Date();
  date.setFullYear(currentYear, currentMonth, 1);

  const month = date.getMonth();
  let weekOfMonth = 1;
  // 1(Sun.) ~ 7(Sat.)
  let dayofweek = date.getDay() + 1;

  let times = gameHistoryDocuments.filter(
    (item) =>
      item.createdAt.toDate().getFullYear() === currentYear &&
      item.createdAt.toDate().getMonth() === month &&
      item.createdAt.toDate().getDate() === date.getDate()
  ).length;

  dailyHistory[dailyHistory.length] = { month, dayofweek, weekOfMonth, day: date.getDate(), times };
  date.setDate(date.getDate() + 1);
  if (date.getDay() + 1 === 1) weekOfMonth += 1;

  // 翌月の1日まで繰り返す
  let j = dailyHistory.length;
  while (date.getDate() !== 1) {
    dayofweek = date.getDay() + 1;

    times = gameHistoryDocuments.filter(
      (item) =>
        item.createdAt.toDate().getFullYear() === currentYear &&
        item.createdAt.toDate().getMonth() === month &&
        item.createdAt.toDate().getDate() === date.getDate()
    ).length;

    dailyHistory[j] = { month, dayofweek, weekOfMonth, day: date.getDate(), times };
    j += 1;
    date.setDate(date.getDate() + 1);
    // 日曜日を該当月の週が切り替わるタイミングとして扱う
    if (date.getDay() + 1 === 1) weekOfMonth = (weekOfMonth % 6) + 1;
  }

  return dailyHistory;
};

// カレンダーヒートマップコンポーネント
const CalendarHeatmap: React.VFC<CalendarHeatmapProps> = ({
  gameHistoryDocuments,
  currentYear,
  currentMonth,
  width,
}) => {
  const chartParent = useRef<HTMLDivElement>(null);
  const chart = useRef<SVGSVGElement>(null);
  const classes = useStyles();

  const dailyData: Dailydata[] = generateDailyHistory(gameHistoryDocuments, currentYear, currentMonth);
  const monthEng = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const margin = { top: 30, right: 15, bottom: 30, left: 15 };
  const w = width - margin.left - margin.right;
  const rectSize = Math.floor(w / 7); // 1マスの幅は横幅/7(日)
  const h = rectSize * 6; // 第1週〜6週分の高さに設定

  // カレンダーの色は、遊んだ回数によって10段階に分ける
  const colorScale = d3
    .scaleSequential()
    .domain([0, 10])
    .interpolator(d3.interpolate(theme.palette.grey[50], "#0099FF"));
  // Sun.(1)->Sat.(7)
  const xScale = d3.scaleBand().domain(["1", "2", "3", "4", "5", "6", "7"]).range([0, w]).padding(0.1);
  // first week(1)-> sixth week(6)
  const yScale = d3.scaleBand().domain(["1", "2", "3", "4", "5", "6"]).range([0, h]).padding(0.1);

  const darkenSquare = (event: Event) => {
    d3.select(event.currentTarget as d3.BaseType).style("opacity", 0.6);
    d3.select(event.currentTarget as d3.BaseType).style("stroke-width", 2);
  };

  const lightenSquare = (event: Event) => {
    d3.select(event.currentTarget as d3.BaseType).style("opacity", 1);
    d3.select(event.currentTarget as d3.BaseType).style("stroke-width", 0.5);
  };

  const showInfo = (event: Event, d: Dailydata) => {
    const mousePointer = d3.pointer(event);

    const info = `${d.times} amount of efforts <br/> on ${d.day} ${monthEng[d.month]}`;

    const tooltip = d3.selectAll(`#tooltip${currentMonth}`).html(info).style("visibility", "visible");

    if (mousePointer[0] < w / 2) {
      tooltip.style("left", `${mousePointer[0] + margin.left}px`);
    } else {
      tooltip.style("left", `${mousePointer[0] - 3 * margin.left - 3 * margin.right}px`);
    }

    if (mousePointer[1] < h / 2 - margin.top) {
      tooltip.style("top", `${mousePointer[1] + margin.top + margin.bottom}px`);
    } else {
      tooltip.style("top", `${mousePointer[1] - margin.top / 2}px`);
    }
  };

  const hideInfo = () => {
    d3.selectAll(`#tooltip${currentMonth}`).style("visibility", "hidden");
  };

  useEffect(() => {
    // ヒートマップsvgを作成
    const svg = d3
      .select(chart.current)
      .attr("width", w + margin.left + margin.right)
      .attr("height", h + margin.top)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    svg
      .selectAll(".dowLabel")
      .data(["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"])
      .enter()
      .append("text")
      .text((d) => d)
      .attr("x", (_, i) => i * rectSize)
      .attr("y", 0)
      .style("text-anchor", "middle")
      .style("font-size", xScale.bandwidth() * 0.35)
      .style("fill", "gray")
      .attr("transform", `translate(${rectSize / 2}, -8)`);

    const drawHeatmap = () => {
      svg
        .selectAll(".play-record")
        .data(dailyData)
        .enter()
        .append("rect")
        .attr("x", (d: Dailydata) => xScale(d.dayofweek.toString()) as number)
        .attr("y", (d: Dailydata) => yScale(d.weekOfMonth.toString()) as number)
        .attr("rx", 1.5)
        .attr("ry", 1.5)
        .attr("width", xScale.bandwidth())
        .attr("height", yScale.bandwidth())
        .style("stroke", "black")
        .style("stroke-width", 0.4)
        .style("stroke-opacity", 1)
        .style("fill", (d: Dailydata) => {
          let colorDomain = d.times;
          if (colorDomain > 5) colorDomain = 5;
          return colorScale(colorDomain);
        })
        .on("mouseover", (event: Event, d: Dailydata) => {
          darkenSquare(event);
          showInfo(event, d);
        })
        .on("mouseleave", (event: Event) => {
          hideInfo();
          lightenSquare(event);
        });
    };
    drawHeatmap();
  });

  return (
    <div style={{ position: "relative", width: w + margin.left + margin.right }} ref={chartParent}>
      <p className={classes.heatmapLabel}>{monthEng[currentMonth]}</p>
      <div id={`tooltip${currentMonth}`} className={classes.tooltip} />
      <svg ref={chart} />
    </div>
  );
};

export default CalendarHeatmap;
