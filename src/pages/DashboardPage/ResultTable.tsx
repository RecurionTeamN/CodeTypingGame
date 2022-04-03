import React from "react";
import { DataGrid, GridColDef, GridOverlay } from "@mui/x-data-grid";
import { makeStyles } from "@mui/styles";
import { State } from "../../context/profile/types";

type ResultTableProps = {
  profileState: State;
  height: number;
  width: number;
};

const useStyles = makeStyles({
  root: {
    "&.MuiDataGrid-root .MuiDataGrid-columnHeader:focus, &.MuiDataGrid-root .MuiDataGrid-cell:focus": {
      outline: "none",
    },
    "& .MuiDataGrid-columnHeaders": {
      backgroundColor: "rgba(137, 189, 222, 0.6)",
      color: "black",
    },
  },
});

const ResultTable: React.VFC<ResultTableProps> = ({ profileState, height, width }) => {
  const classes = useStyles();

  const columns: GridColDef[] = [
    {
      field: "codeLang",
      headerName: "Code Language",
      width: width / 3,
      headerAlign: "left",
    },
    {
      field: "accuracy",
      headerName: "Best accuracy [%]",
      width: width / 3,
      headerAlign: "right",
    },
    {
      field: "speed",
      headerName: "Best speed [kpm]",
      type: "number",
      width: width / 3,
      headerAlign: "right",
    },
  ];

  const profileStateforTable = Object.entries(profileState.bestScores).map(
    ([codeLang, value]): {
      id: string;
      codeLang: string;
      accuracy: number | null;
      speed: number | null;
    } => ({
      id: codeLang,
      codeLang,
      accuracy: value.accuracy,
      speed: value.speed,
    })
  );

  const profileStateforTableWithoutEmptyData = profileStateforTable.filter(
    (item) => item.accuracy !== null && item.speed !== null
  );

  const customNoRowsOverlay = () => (
    <GridOverlay>
      <div>No Data</div>
    </GridOverlay>
  );

  return (
    <div style={{ height, width }}>
      <DataGrid
        rows={profileStateforTableWithoutEmptyData.sort((prev, curr) => prev.codeLang.localeCompare(curr.codeLang))}
        rowHeight={50}
        columns={columns}
        pageSize={4}
        rowsPerPageOptions={[4]}
        disableSelectionOnClick
        disableColumnMenu
        disableColumnFilter
        className={classes.root}
        components={{
          NoRowsOverlay: customNoRowsOverlay,
        }}
      />
    </div>
  );
};

export default ResultTable;
