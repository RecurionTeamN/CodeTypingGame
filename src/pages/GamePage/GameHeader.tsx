import React from "react";
import { AppBar, Typography, Toolbar, Button, Theme } from "@mui/material";
import { makeStyles } from "@mui/styles";
import CodeLanguageIcon from "../../components/CodeLanguageIcon";
import formatTime from "../../utils/formatTime";
import { CodeLangTypes } from "../../context/profile/types";

type Props = {
  codeLanguage: CodeLangTypes;
  timeTyping: number;
  missCount: number;
  started: boolean;
  reset: () => void;
  start: () => void;
};

const useStyles = makeStyles((theme: Theme) => ({
  appbar: {
    backgroundColor: theme.palette.grey[800],
  },
  codeLanguageContainer: {
    display: "flex",
    alignItems: "center",
  },
}));

const GameHeader: React.VFC<Props> = ({ codeLanguage, timeTyping, missCount, started, reset, start }) => {
  const classes = useStyles();

  return (
    <AppBar className={classes.appbar} position="static">
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography variant="body1">
          タイム: <strong>{formatTime(timeTyping)}</strong>
          <br />
          ミスタイプ: <strong>{missCount}回</strong>
        </Typography>
        <div className={classes.codeLanguageContainer}>
          <CodeLanguageIcon codeLanguage={codeLanguage} size={30} />
          <Typography variant="h6" sx={{ marginLeft: "10px" }}>
            {codeLanguage}
          </Typography>
        </div>
        {started ? (
          <Button variant="contained" color="inherit" sx={{ color: "black" }} onClick={reset}>
            reset
          </Button>
        ) : (
          <Button variant="contained" color="primary" sx={{ color: "white" }} onClick={start}>
            start
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default GameHeader;
