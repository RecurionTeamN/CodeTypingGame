import React, { useState, useRef } from "react";
import { StyledEngineProvider } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import { Typography, Card, CardContent, Theme } from "@mui/material";
import GameHeader from "./GameHeader";
import SuccessModal from "./SuccessModal";
import Header from "../../components/Header";
import KeyboardHand from "./KeyboardHand";
import { KeyData } from "../../data/keyboardData";
import { Language } from "../HomePage/CodeContentData";

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  textBox: {
    padding: "10px",
    whiteSpace: "pre-wrap",
    cursor: "pointer",
    "&:focus": {
      outline: "none",
    },
  },
  greenFont: {
    color: theme.palette.success.light,
    display: "inline",
    fontSize: theme.typography.body1.fontSize,
  },
  redFont: {
    backgroundColor: theme.palette.background.default,
    color: theme.palette.warning.main,
    display: "inline",
    fontSize: theme.typography.body1.fontSize,
  },
  greyFont: {
    color: "grey",
    display: "inline",
    fontSize: theme.typography.body1.fontSize,
  },
  blackFont: {
    backgroundColor: theme.palette.background.default,
    display: "inline",
    fontSize: theme.typography.body1.fontSize,
  },
  card: {
    backgroundColor: theme.palette.grey[50],
    width: "60%",
    height: "400px",
  },
}));

type Props = {
  codeContent: string;
  language: Language;
  gameData: {
    speed: number;
    accuracy: number;
    keyData: KeyData;
  };
  pastGameData: {
    history: {
      [date: string]: [
        {
          speed: number;
          accuracy: number;
        }
      ];
    };
    bestScores: {
      [codeLang in Language]: {
        speed: number;
        accuracy: number;
      };
    };
  };
  commitResult: React.Dispatch<
    React.SetStateAction<{
      speed: number;
      accuracy: number;
      keyData: KeyData;
    }>
  >;
  updateHistory: React.Dispatch<
    React.SetStateAction<{
      history: {
        [date: string]: [
          {
            speed: number;
            accuracy: number;
          }
        ];
      };
      bestScores: {
        [codeLang in Language]: {
          speed: number;
          accuracy: number;
        };
      };
    }>
  >;
};

type NextFinger = {
  leftHand: "thumb" | "first" | "second" | "third" | "fourth" | null;
  rightHand: "thumb" | "first" | "second" | "third" | "fourth" | null;
};

const GamePage: React.FC<Props> = ({ codeContent, language, gameData, pastGameData, commitResult, updateHistory }) => {
  const classes = useStyles();

  const typingText = codeContent;

  // const [typingText, setTypingText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMissType, setIsMissType] = useState(false);
  const [missCount, setMissCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const [started, setStarted] = useState(false);
  const [timeTyping, setTimeTyping] = useState(0);
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  const [keyData, setKeyData] = useState(gameData.keyData);
  const [lastAnsTime, setLastAnsTime] = useState(0);
  const [nextFinger, setNextFinger] = useState<NextFinger>({ leftHand: null, rightHand: null });

  const addKeyPushCount = (keyName: string): void => {
    const targetData = keyData[keyName];
    const cnt = (targetData.pushCount ?? 0) + 1;
    targetData.pushCount = cnt;
    setKeyData((prev) => ({
      ...prev,
      [keyName]: targetData,
    }));
  };
  const addKeyMissCount = (keyName: string): void => {
    const targetData = keyData[keyName];
    const cnt = (targetData.missCount ?? 0) + 1;
    targetData.missCount = cnt;
    setKeyData((prev) => ({
      ...prev,
      [keyName]: targetData,
    }));
  };
  const addKeyTimeCount = (keyName: string): void => {
    const targetData = keyData[keyName];
    const cnt = (targetData.timeSecCount ?? 0) + (timeTyping - lastAnsTime) / 1000;
    targetData.timeSecCount = cnt;
    setKeyData((prev) => ({
      ...prev,
      [keyName]: targetData,
    }));
  };
  const handleNextFinger = (Index: number) => {
    const targetData = keyData[typingText.charAt(Index)];
    if (targetData.keyType === "shift") {
      if (targetData.hand === "left") {
        setNextFinger({
          leftHand: targetData.finger,
          rightHand: keyData["r-Shift"].finger,
        });
      } else {
        setNextFinger({
          leftHand: keyData["l-Shift"].finger,
          rightHand: targetData.finger,
        });
      }
    } else if (targetData.keyType === "option") {
      // 現状はmac-jisの\でしかoption Keyは使わない。
      setNextFinger({
        leftHand: keyData.option.finger,
        rightHand: null,
      });
      // 以下default Keyの条件分岐
    } else if (targetData.hand === "left") {
      setNextFinger({
        leftHand: targetData.finger,
        rightHand: null,
      });
    } else {
      setNextFinger({
        leftHand: null,
        rightHand: targetData.finger,
      });
    }
  };
  const handleGameHistory = (speed: number, accuracy: number) => {
    const pastData = pastGameData;
    if (pastData.bestScores[language].speed < speed && pastData.bestScores[language].accuracy < accuracy) {
      pastData.bestScores[language].speed = speed;
      pastData.bestScores[language].accuracy = accuracy;
    }
    const date = new Date();
    const todayStr = `${date.getFullYear()}/${date.getMonth()}/${date.getDate()}`;
    // 既に同じ日にゲーム記録がある場合とない場合
    if (pastData.history[todayStr]) pastData.history[todayStr].push({ speed: speed, accuracy: accuracy });
    else pastData.history[todayStr] = [{ speed: speed, accuracy: accuracy }];
    updateHistory(pastData);
  };
  const calSpeedKPM = (textLength: number, totalTimeMilliSec: number) =>
    Math.floor(60 * (textLength / (totalTimeMilliSec / 1000)));
  const calAccuracy = (textLength: number, missCnt: number) => Math.floor((100 * textLength) / (textLength + missCnt));

  const timer = useRef<NodeJS.Timer | null>(null);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (finished) return;
    if (!started) {
      setStarted(true);
      const startTime = new Date().getTime();
      timer.current = setInterval(() => {
        setTimeTyping(new Date().getTime() - startTime);
      }, 10);
    }

    addKeyPushCount(e.key);

    // 改行の処理
    if (typingText[currentIndex] === "\n") {
      if (e.key === "Enter") {
        setIsMissType(false);

        addKeyTimeCount(e.key);
        setLastAnsTime(timeTyping);

        // while ループで改行後に続くタブを i を使ってスキップする
        let i = 1;
        while (currentIndex + i < typingText.length) {
          if (typingText[currentIndex + i] === "\t" || typingText[currentIndex + i] === " ") i += 1;
          else break;
        }

        if (currentIndex + i >= typingText.length) {
          clearInterval(timer.current as NodeJS.Timer);
          setFinished(true);
          setSuccessModalOpen(true);
        } else {
          setCurrentIndex(currentIndex + i);
          handleNextFinger(currentIndex + i);
        }
      } else {
        setIsMissType(true);
        setMissCount(missCount + 1);
        addKeyMissCount("Enter");
      }
    } else if (e.key === typingText[currentIndex]) {
      setIsMissType(false);
      setCurrentIndex(currentIndex + 1);

      addKeyTimeCount(e.key);
      setLastAnsTime(timeTyping);

      if (currentIndex + 1 >= typingText.length) {
        clearInterval(timer.current as NodeJS.Timeout);
        setFinished(true);
        setSuccessModalOpen(true);
        commitResult({
          speed: calSpeedKPM(typingText.length, timeTyping),
          accuracy: calAccuracy(typingText.length, missCount),
          keyData,
        });
        handleGameHistory(calSpeedKPM(typingText.length, timeTyping), calAccuracy(typingText.length, missCount));
      } else handleNextFinger(currentIndex + 1);
    } else {
      setIsMissType(true);
      setMissCount(missCount + 1);
      addKeyMissCount(typingText[currentIndex]);
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
    setKeyData(gameData.keyData);
    setLastAnsTime(0);
    handleNextFinger(0);
  };

  return (
    <StyledEngineProvider injectFirst>
      <Header />
      <div className={classes.container}>
        <Card className={classes.card}>
          <GameHeader timeTyping={timeTyping} missCount={missCount} reset={reset} />
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

        <KeyboardHand leftFin={nextFinger.leftHand} rightFin={nextFinger.rightHand} />
      </div>

      <SuccessModal
        result={{
          timeTyping,
          missCount,
          textLength: typingText.length,
        }}
        successModalOpen={successModalOpen}
        successModalClose={() => setSuccessModalOpen(false)}
      />
    </StyledEngineProvider>
  );
};

export default GamePage;
