import React, { useState, useRef, createRef } from "react";
import { StyledEngineProvider } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import { Typography, Card, CardContent, Theme } from "@mui/material";
import GameHeader from "./GameHeader";
import SuccessModal from "./SuccessModal";
import Header from "../../components/Header";
import KeyboardHand from "./KeyboardHand";
import { KeyData } from "../../data/keyboardData";
import useProfileContext from "../../hooks/useProfileContext";

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
    height: "45vh",
  },
  cardContent: {
    height: "300px",
    overflow: "auto",
    "&::-webkit-scrollbar": {
      display: "none",
    },
  },
}));

type Props = {
  currGameData: {
    speed: number;
    accuracy: number;
    keyData: KeyData;
  };
  setCurrGameData: React.Dispatch<
    React.SetStateAction<{
      speed: number;
      accuracy: number;
      keyData: KeyData;
    }>
  >;
};

type NextFinger = {
  leftHand: "thumb" | "first" | "second" | "third" | "fourth" | null;
  rightHand: "thumb" | "first" | "second" | "third" | "fourth" | null;
};

const GamePage: React.FC<Props> = ({ currGameData, setCurrGameData }) => {
  const classes = useStyles();
  const { profileState } = useProfileContext();
  const { userSettings } = profileState;

  const typingText = userSettings.codeContent;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMissType, setIsMissType] = useState(false);
  const [missCount, setMissCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const [started, setStarted] = useState(false);
  const [timeTyping, setTimeTyping] = useState(0);
  const [successModalOpen, setSuccessModalOpen] = useState(false);

  const [keyData, setKeyData] = useState(currGameData.keyData);
  const [lastAnsTime, setLastAnsTime] = useState(0);
  const [nextFinger, setNextFinger] = useState<NextFinger>({ leftHand: null, rightHand: null });
  const [nextKeys, setNextKeys] = useState<string[]>([]);

  const scrollBox = createRef<HTMLDivElement>();
  const scroll = () => {
    scrollBox.current?.scrollBy({ top: 25, behavior: "smooth" });
  };
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
    const targetData = typingText.charAt(Index) !== "\n" ? keyData[typingText.charAt(Index)] : keyData.Enter;
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
        rightHand: targetData.finger,
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
  const handleNextKeys = (index: number) => {
    const targetKey = typingText.charAt(index) !== "\n" ? typingText.charAt(index) : "Enter";
    const nextKeyArr: string[] = [];
    if (keyData[targetKey].keyType === "default") nextKeyArr.push(targetKey);
    else if (keyData[targetKey].keyType === "option") {
      nextKeyArr.push("option");
      Object.keys(keyData)
        .filter(
          (keyName) =>
            keyData[keyName].keyType === "default" &&
            keyData[keyName].position[0] === keyData[targetKey].position[0] &&
            keyData[keyName].position[1] === keyData[targetKey].position[1]
        )
        .forEach((keyName) => {
          nextKeyArr.push(keyName);
        });
    } else {
      nextKeyArr.push(keyData[targetKey].hand === "left" ? "r-Shift" : "l-Shift");
      Object.keys(keyData)
        .filter(
          (keyName) =>
            keyData[keyName].keyType === "default" &&
            keyData[keyName].position[0] === keyData[targetKey].position[0] &&
            keyData[keyName].position[1] === keyData[targetKey].position[1]
        )
        .forEach((keyName) => {
          nextKeyArr.push(keyName);
        });
    }
    setNextKeys(nextKeyArr);
  };

  // const handleGameHistory = (speed: number, accuracy: number) => {
  //   const pastData = pastGameData;
  //   if (pastData.bestScores[language].speed < speed && pastData.bestScores[language].accuracy < accuracy) {
  //     pastData.bestScores[language].speed = speed;
  //     pastData.bestScores[language].accuracy = accuracy;
  //   }
  //   const date = new Date();
  //   const todayStr = `${date.getFullYear()}/${date.getMonth()}/${date.getDate()}`;
  //   // 既に同じ日にゲーム記録がある場合とない場合
  //   if (pastData.history[todayStr]) pastData.history[todayStr].push({ speed, accuracy });
  //   else pastData.history[todayStr] = [{ speed, accuracy }];
  //   updateHistory(pastData);
  // };

  const calSpeedKPM = (textLength: number, totalTimeMilliSec: number) =>
    Math.floor(60 * (textLength / (totalTimeMilliSec / 1000)));
  const calAccuracy = (textLength: number, missCnt: number) => Math.floor((100 * textLength) / (textLength + missCnt));

  const timer = useRef<NodeJS.Timer | null>(null);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (finished) return;
    if (!started) {
      setStarted(true);
      scrollBox.current?.scrollTo({ top: 0, behavior: "smooth" });

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
        scroll();

        if (currentIndex + i >= typingText.length) {
          clearInterval(timer.current as NodeJS.Timer);
          setFinished(true);
          setSuccessModalOpen(true);
        } else {
          setCurrentIndex(currentIndex + i);
          handleNextFinger(currentIndex + i);
          handleNextKeys(currentIndex + i);
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
        setCurrGameData({
          speed: calSpeedKPM(typingText.length, timeTyping),
          accuracy: calAccuracy(typingText.length, missCount),
          keyData,
        });
      } else {
        handleNextFinger(currentIndex + 1);
        handleNextKeys(currentIndex + 1);
      }
    } else {
      setIsMissType(true);
      setMissCount(missCount + 1);
      addKeyMissCount(typingText[currentIndex]);
    }
  };

  // ゲームの初期化
  const reset = () => {
    clearInterval(timer.current as NodeJS.Timeout);
    scrollBox.current?.scrollTo({ top: 0, behavior: "smooth" });
    setTimeTyping(0);
    setCurrentIndex(0);
    setIsMissType(false);
    setMissCount(0);
    setFinished(false);
    setStarted(false);
    setKeyData(currGameData.keyData);
    setLastAnsTime(0);
    handleNextFinger(0);
    handleNextKeys(0);
  };

  // Enterを押すべき時に何も表示されないと分かりづらいので追加
  let currText = typingText[currentIndex];
  if (currText === "\n") currText = "↩︎\n";

  return (
    <StyledEngineProvider injectFirst>
      <Header />
      <div className={classes.container}>
        <Card className={classes.card}>
          <GameHeader
            codeLanguage={userSettings.codeLang}
            timeTyping={timeTyping}
            missCount={missCount}
            reset={reset}
          />
          <CardContent className={classes.cardContent} ref={scrollBox}>
            <div onKeyPress={(e) => handleKeyPress(e)} tabIndex={-1} className={classes.textBox} aria-hidden="true">
              {/* for correct letters */}
              <Typography className={classes.greenFont}>{typingText.slice(0, currentIndex)}</Typography>

              {/* for incorrect letters */}
              {isMissType ? (
                <Typography className={classes.redFont}>{currText}</Typography>
              ) : (
                <Typography className={classes.blackFont}>{currText}</Typography>
              )}

              {/* for remaining letters */}
              <Typography className={classes.greyFont}>
                {typingText.slice(currentIndex + 1, typingText.length)}
              </Typography>
            </div>
          </CardContent>
        </Card>

        <KeyboardHand
          keyboardType={userSettings.keyboardType}
          nextKeys={nextKeys}
          leftFin={nextFinger.leftHand}
          rightFin={nextFinger.rightHand}
        />
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
