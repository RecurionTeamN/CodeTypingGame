import React, { useState, useRef } from "react";
import { StyledEngineProvider } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import { Typography, Card, CardContent } from "@mui/material";
import GameHeader from "../components/GameHeader";

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
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  textBox: {
    padding: "20px",
    marginTop: "5px",
    whiteSpace: "pre-wrap",
    cursor: "pointer",
    "&:focus": {
      outline: "none",
    },
  },
  greenFont: {
    color: "#33CC33",
    display: "inline",
    fontSize: "25px",
  },
  redFont: {
    backgroundColor: "#e0e0e0",
    color: "red",
    display: "inline",
    fontSize: "25px",
  },
  greyFont: {
    color: "grey",
    display: "inline",
    fontSize: "25px",
  },
  blackFont: {
    backgroundColor: "#e0e0e0",
    display: "inline",
    fontSize: "25px",
  },
  card: {
    marginTop: "20px",
    minWidth: "70%",
  },
}));

const GamePage = () => {
  const classes = useStyles();

  // temporary typing text
  const typingText =
    "import React, { useState, useEffect, useRef } from 'react';\nconst [isMissType, setIsMissType] = useState<boolean>(false);\nif (!started) {\n  setStarted(true);\n}\nconst timer = useRef<NodeJS.Timer | null>(null);";
  // const typingText = "import React\n";

  // const [typingText, setTypingText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMissType, setIsMissType] = useState(false);
  const [missCount, setMissCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const [started, setStarted] = useState(false);
  const [timeTyping, setTimeTyping] = useState(0);

  const timer = useRef<NodeJS.Timer | null>(null);

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

    // 改行の処理
    if (typingText[currentIndex] === "\n") {
      if (e.key === "Enter") {
        setIsMissType(false);

        // while ループで改行後に続くタブを i を使ってスキップする
        let i = 1;
        while (currentIndex + i < typingText.length) {
          if (typingText[currentIndex + i] === "\t" || typingText[currentIndex + i] === " ") i += 1;
          else break;
        }

        if (currentIndex + i >= typingText.length) {
          clearInterval(timer.current as NodeJS.Timer);
          setFinished(true);
        } else {
          setCurrentIndex(currentIndex + i);
        }
      } else {
        setIsMissType(true);
        setMissCount(missCount + 1);
      }
    } else if (e.key === typingText[currentIndex]) {
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

  // ゲームの初期化
  const reset = () => {
    clearInterval(timer.current as NodeJS.Timeout);
    setTimeTyping(0);

    setCurrentIndex(0);
    setIsMissType(false);
    setMissCount(0);
    setFinished(false);
    setStarted(false);
  };

  return (
    <StyledEngineProvider injectFirst>
      <GameHeader timeTyping={timeTyping} missCount={missCount} reset={reset} />
      <div className={classes.container}>
        <Card className={classes.card}>
          <CardContent>
            <div onKeyPress={(e) => handleKeyPress(e)} tabIndex={-1} className={classes.textBox} aria-hidden="true">
              {/* for correct letters */}
              <Typography className={classes.greenFont}>{typingText.slice(0, currentIndex)}</Typography>

              {/* for incorrect letters */}
              {isMissType ? (
                <Typography className={classes.redFont}>{typingText[currentIndex]}</Typography>
              ) : (
                <Typography className={classes.blackFont}>{typingText[currentIndex]}</Typography>
              )}

              {/* for remaining letters */}
              <Typography className={classes.greyFont}>
                {typingText.slice(currentIndex + 1, typingText.length)}
              </Typography>
            </div>
          </CardContent>
        </Card>
      </div>
    </StyledEngineProvider>
  );
};

export default GamePage;
