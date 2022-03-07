import React, { useState, useRef } from "react";
import { StyledEngineProvider } from "@mui/material/styles";

import { makeStyles } from "@mui/styles";
import { Typography, Box } from "@mui/material";

import formatTime from "../utils/utils";

const useStyles = makeStyles(() => ({
  statsContainer: {
    display: "flex",
    justifyContent: "center",
  },
  stats: {
    display: "inline",
    fontSize: "30px",
    margin: "0 30px",
  },
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  textBox: {
    padding: "30px",
    marginBottom: "30px",
    maxWidth: "70%",
  },
  blueFont: {
    color: "#2bbeed",
    display: "inline",
    fontSize: "50px",
  },
  redFont: {
    backgroundColor: "#e0e0e0",
    color: "red",
    display: "inline",
    fontSize: "50px",
  },
  greyFont: {
    color: "grey",
    display: "inline",
    fontSize: "50px",
  },
  blackFont: {
    backgroundColor: "#e0e0e0",
    display: "inline",
    fontSize: "50px",
  },
}));

const GamePage = () => {
  const classes = useStyles();

  // temporary typing text
  const typingText =
    "import React, { useState, useEffect, useRef } from 'react'; const [isMissType, setIsMissType] = useState<boolean>(false);";

  // const [typingText, setTypingText] = useState("");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isMissType, setIsMissType] = useState<boolean>(false);
  const [missCount, setMissCount] = useState<number>(0);
  const [finished, setFinished] = useState<boolean>(false);
  const [started, setStarted] = useState<boolean>(false);
  const [timeTyping, setTimeTyping] = useState<number>(0);

  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // eslint-disable-next-line no-console
    console.log(e.key);

    if (finished) return;
    if (!started) {
      setStarted(true);
      const startTime = new Date().getTime();
      timer.current = setInterval(() => {
        setTimeTyping(new Date().getTime() - startTime);
      }, 10);
    }

    if (e.key === typingText[currentIndex]) {
      setIsMissType(false);
      setCurrentIndex(currentIndex + 1);
      if (currentIndex + 1 >= typingText.length) {
        clearInterval(timer.current as NodeJS.Timeout);
        setFinished(true);
      }
    } else {
      setIsMissType(true);
      setMissCount(missCount + 1);
    }
  };

  return (
    <StyledEngineProvider injectFirst>
      <div className={classes.container}>
        <Box className={classes.statsContainer}>
          <Typography className={classes.stats}>タイム: {formatTime(timeTyping)}</Typography>
          <Typography className={classes.stats}>ミスタイプ: {missCount}回</Typography>
        </Box>
        <div onKeyPress={(e) => handleKeyPress(e)} tabIndex={-1} className={classes.textBox} aria-hidden="true">
          {/* for correct letters */}
          <Typography className={classes.blueFont}>{typingText.slice(0, currentIndex)}</Typography>

          {/* for incorrect letters */}
          {isMissType ? (
            <Typography className={classes.redFont}>{typingText[currentIndex]}</Typography>
          ) : (
            <Typography className={classes.blackFont}>{typingText[currentIndex]}</Typography>
          )}

          {/* for remaining letters */}
          <Typography className={classes.greyFont}>{typingText.slice(currentIndex + 1, typingText.length)}</Typography>
        </div>
      </div>
    </StyledEngineProvider>
  );
};

export default GamePage;
