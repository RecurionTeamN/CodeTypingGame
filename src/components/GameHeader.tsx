import React from "react";
import { AppBar, Typography, Box, Toolbar, Button } from "@mui/material";
import formatTime from "../utils/formatTime";

type Props = {
  timeTyping: number;
  missCount: number;
  reset: VoidFunction;
};

const GameHeader: React.VFC<Props> = ({ timeTyping, missCount, reset }) => (
  <Box>
    <AppBar position="static" sx={{ p: 1 }}>
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

export default GameHeader;
