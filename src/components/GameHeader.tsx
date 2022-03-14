import React from "react";
import { AppBar, Typography, Box, Toolbar, Button, Theme } from "@mui/material";
import { makeStyles } from "@mui/styles";
import formatTime from "../utils/formatTime";

type Props = {
  timeTyping: number;
  missCount: number;
  reset: () => void;
};

const useStyles = makeStyles((theme: Theme) => ({
  appbar: {
    backgroundColor: theme.palette.primary.main,
  },
}));

const GameHeader: React.VFC<Props> = ({ timeTyping, missCount, reset }) => {
  const classes = useStyles();

  return (
    <Box>
      <AppBar className={classes.appbar} position="static">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box>
            <Typography variant="h3" component="div">
              Typing Game
            </Typography>
          </Box>
          <Box>
            <Typography variant="h5" component="div">
              タイム: <strong>{formatTime(timeTyping)}</strong>
            </Typography>
            <Typography variant="h5" component="div">
              ミスタイプ: <strong>{missCount} 回</strong>
            </Typography>
            <Button variant="contained" color="inherit" onClick={reset}>
              reset
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default GameHeader;
