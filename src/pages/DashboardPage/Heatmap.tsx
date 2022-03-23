import React from "react";
import { HeatMapGrid } from "react-grid-heatmap";

const weekOfMonth = ["first", "second", "third", "fourth", "fifth"];
const dayOfTheWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];
const data = new Array(weekOfMonth.length)
  .fill(0)
  .map(() => new Array(dayOfTheWeek.length).fill(0).map(() => Math.floor(Math.random() * 50 + 50)));

const cellInfo = (x: number, y: number, value: number) => <div title={`Pos(${x}, ${y}) = ${value}`}>{value}</div>;

const Heatmap = () => (
  <div
    style={{
      width: "100%",
    }}
  >
    <HeatMapGrid
      data={data}
      xLabels={dayOfTheWeek}
      // Reder cell with tooltip
      cellRender={(x, y, value) => cellInfo(x, y, value)}
      xLabelsStyle={(index) => ({
        color: index % 2 ? "transparent" : "#777",
        fontSize: ".8rem",
      })}
      yLabelsStyle={() => ({
        fontSize: ".7rem",
        textTransform: "uppercase",
        color: "#777",
      })}
      cellStyle={(_x, _y, ratio) => ({
        background: `rgb(12, 160, 44, ${ratio})`,
        fontSize: ".8rem",
        color: `rgb(0, 0, 0, ${ratio / 2 + 0.4})`,
      })}
      cellHeight="2rem"
      xLabelsPos="top"
      // eslint-disable-next-line no-alert
      onClick={(x, y) => alert(`Clicked (${x}, ${y})`)}
      yLabelsPos="right"
      square
    />
  </div>
);

export default Heatmap;
