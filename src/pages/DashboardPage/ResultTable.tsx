import React from "react";
import { DataGrid, GridColDef, GridOverlay } from "@mui/x-data-grid";
import { makeStyles } from "@mui/styles";
import useProfileContext from "../../hooks/useProfileContext";

type ResultTableProps = {
  tableHeight: number;
};

const useStyles = makeStyles({
  dataGrid: {
    "&.MuiDataGrid-root .MuiDataGrid-columnHeader:focus, &.MuiDataGrid-root .MuiDataGrid-cell:focus": {
      outline: "none",
    },
    "& .MuiDataGrid-columnHeaders": {
      backgroundColor: "rgba(137, 189, 222, 0.6)",
      color: "black",
    },
    "& .MuiDataGrid-cell .MuiDataGrid-columnHeaderTitleContainer .MuiDataGrid-cellContent": {
      padding: 39,
    },
  },
});

const ResultTable: React.VFC<ResultTableProps> = ({ tableHeight }) => {
  const classes = useStyles();
  const { profileState } = useProfileContext();
  const columns: GridColDef[] = [
    {
      field: "codeLang",
      headerName: "Code Language",
      minWidth: 150,
      flex: 1,
      headerAlign: "left",
    },
    {
      field: "accuracy",
      headerName: "Best accuracy [%]",
      minWidth: 150,
      flex: 1,
      headerAlign: "right",
      align: "right",
    },
    {
      field: "speed",
      headerName: "Best speed [kpm]",
      type: "number",
      minWidth: 150,
      flex: 1,
      headerAlign: "right",
      align: "right",
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
    <div style={{ display: "flex", height: tableHeight }}>
      <DataGrid
        rows={profileStateforTableWithoutEmptyData.sort((prev, curr) => prev.codeLang.localeCompare(curr.codeLang))}
        columns={columns}
        pageSize={4}
        rowsPerPageOptions={[4]}
        disableSelectionOnClick
        disableColumnMenu
        className={classes.dataGrid}
        components={{
          NoRowsOverlay: customNoRowsOverlay,
        }}
      />
    </div>
  );
};

export default ResultTable;
