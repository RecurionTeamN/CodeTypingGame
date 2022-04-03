import React from "react";
import { AppBar, Typography, Box, Toolbar, Button, Theme } from "@mui/material";
import { makeStyles } from "@mui/styles";
import CodeLanguageIcon from "../../components/CodeLanguageIcon";
import formatTime from "../../utils/formatTime";
import { CodeLangTypes } from "../../context/profile/types";

type Props = {
  codeLanguage: CodeLangTypes;
  timeTyping: number;
  missCount: number;
  reset: () => void;
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

const GameHeader: React.VFC<Props> = ({ codeLanguage, timeTyping, missCount, reset }) => {
  const classes = useStyles();

  return (
    <Box>
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
          <Button variant="contained" color="inherit" sx={{ color: "black" }} onClick={reset}>
            reset
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default GameHeader;
