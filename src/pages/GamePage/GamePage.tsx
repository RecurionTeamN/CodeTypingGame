import React, { useState, useRef, createRef } from "react";
import { makeStyles } from "@mui/styles";
import { Typography, Card, CardContent, Theme } from "@mui/material";
import { toast } from "react-toastify";
import GameHeader from "./GameHeader";
import GameFinishModal from "./GameFinishModal";
import Header from "../../components/Header";
import KeyboardHand from "./KeyboardHand";
import { KeyData } from "../../data/keyboardData";
import useProfileContext from "../../hooks/useProfileContext";
import useAuthContext from "../../hooks/useAuthContext";
import addGameHistoryDoc from "../../firebase/utils/addGameHistoryDoc";
import setProfilesDoc from "../../firebase/utils/setProfilesDoc";
import { BestScores } from "../../context/profile/types";

const useStyles = makeStyles((theme: Theme) => ({
  mainContainer: {
    height: "100vh",
    overflow: "hidden",
  },
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
    backgroundColor: theme.palette.grey[100],
    borderRadius: "0 0 25px 25px",
    width: "60%",
    height: "40vh",
  },
  keyboardContainer: {
    width: "60%",
    display: "flex",
    justifyContent: "center",
  },
  gameHeader: {
    width: "60%",
    borderRadius: "25px 25px 0 0",
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
  const { profileState, dispatch: profileDispatch } = useProfileContext();
  const { authState } = useAuthContext();
  const { userSettings } = profileState;

  // firebase ??? "\n" ?????????????????????????????? "\\n" ????????????????????????"\n" ?????????
  const typingText = userSettings.codeContent.replace(/\\n/g, "\n");

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

  const keyDataReset = () => {
    Object.keys(keyData).forEach((keyName) => {
      keyData[keyName].pushCount = 0;
      keyData[keyName].missCount = 0;
      keyData[keyName].timeSecCount = 0;
    });
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
      // ?????????mac-jis???\?????????option Key??????????????????
      setNextFinger({
        leftHand: keyData.option.finger,
        rightHand: targetData.finger,
      });
      // ??????default Key???????????????
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
      const k = Object.keys(keyData).find(
        (keyName) =>
          keyData[keyName].keyType === "default" &&
          keyData[keyName].position[0] === keyData[targetKey].position[0] &&
          keyData[keyName].position[1] === keyData[targetKey].position[1]
      );
      if (typeof k !== "undefined") {
        nextKeyArr.push(k);
      } else {
        // eslint-disable-next-line no-console
        console.error("Error with option key: There is not the default key that has the same position.");
      }
    } else if (keyData[targetKey].keyType === "shift") {
      nextKeyArr.push(keyData[targetKey].hand === "left" ? "r-Shift" : "l-Shift");
      const k = Object.keys(keyData).find(
        (keyName) =>
          keyData[keyName].keyType === "default" &&
          keyData[keyName].position[0] === keyData[targetKey].position[0] &&
          keyData[keyName].position[1] === keyData[targetKey].position[1]
      );
      if (typeof k !== "undefined") {
        nextKeyArr.push(k);
      } else {
        // eslint-disable-next-line no-console
        console.error("Error with shift key: There is not the default key that has the same position.");
      }
    } else {
      // eslint-disable-next-line no-console
      console.error("Invalid key error: There is not such a key in the keyboard data.");
    }
    setNextKeys(nextKeyArr);
  };

  const calSpeedKPM = (textLength: number, totalTimeMilliSec: number) =>
    Math.floor(60 * (textLength / (totalTimeMilliSec / 1000)));
  const calAccuracy = (textLength: number, missCnt: number) => Math.floor((100 * textLength) / (textLength + missCnt));

  const timer = useRef<NodeJS.Timer | null>(null);

  const gameFinished = () => {
    clearInterval(timer.current as NodeJS.Timer);

    const speed = calSpeedKPM(typingText.length, timeTyping);
    const accuracy = calAccuracy(typingText.length, missCount);
    setFinished(true);
    setSuccessModalOpen(true);
    setCurrGameData({
      speed,
      accuracy,
      keyData,
    });
    if (authState.user) {
      // Firebase ????????????????????????????????? GameHistory ?????????????????????????????????
      addGameHistoryDoc(authState.user?.uid, accuracy, userSettings.codeLang, speed).catch((err) =>
        toast.error((err as Error).message)
      );

      // Firebase ???????????? userSettings ??? bestScores ??? Profiles ?????????????????????????????????
      const currBestScore = profileState.bestScores[userSettings.codeLang];
      const currLanguage = userSettings.codeLang;
      let updatedBestScores = { ...profileState.bestScores };

      // ??????????????????????????????????????? null ?????????
      if (currBestScore.accuracy === null || currBestScore.speed === null) {
        updatedBestScores = { ...updatedBestScores, [currLanguage]: { accuracy, speed } };
        profileDispatch({ type: "SET_BESTSCORES", payload: updatedBestScores as BestScores });
      }
      // ????????????????????????????????????????????????????????????????????????
      else if (currBestScore.accuracy && currBestScore.speed) {
        if (currBestScore.accuracy + 0.5 * currBestScore.speed < accuracy + 0.5 * speed) {
          updatedBestScores = { ...updatedBestScores, [currLanguage]: { accuracy, speed } };
          profileDispatch({ type: "SET_BESTSCORES", payload: updatedBestScores as BestScores });
        }
      }

      // Firebase ?????????????????????
      setProfilesDoc(authState.user.uid, updatedBestScores, profileState.userSettings).catch((err) =>
        toast.error((err as Error).message)
      );
    }
  };

  const handleStart = () => {
    setStarted(true);
    scrollBox.current?.scrollTo({ top: 0, behavior: "smooth" });
    const startTime = new Date().getTime();
    timer.current = setInterval(() => {
      setTimeTyping(new Date().getTime() - startTime);
    }, 10);
    keyDataReset();
    handleNextFinger(0);
    handleNextKeys(0);
    document.getElementById("code-content")?.focus();
  };

  // ?????????????????????
  const reset = () => {
    clearInterval(timer.current as NodeJS.Timeout);
    scrollBox.current?.scrollTo({ top: 0, behavior: "smooth" });
    setTimeTyping(0);
    setCurrentIndex(0);
    setIsMissType(false);
    setMissCount(0);
    setFinished(false);
    setStarted(false);
    keyDataReset();
    setLastAnsTime(0);
    handleNextFinger(0);
    handleNextKeys(0);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (finished || !started) return;

    // ???????????????
    if (typingText[currentIndex] === "\n") {
      if (e.key === "Enter") {
        setIsMissType(false);
        addKeyPushCount(e.key);
        addKeyTimeCount(e.key);
        setLastAnsTime(timeTyping);

        // while ??????????????????????????????????????? i ??????????????????????????????
        let i = 1;
        while (currentIndex + i < typingText.length) {
          if (typingText[currentIndex + i] === "\t" || typingText[currentIndex + i] === " ") i += 1;
          else break;
        }
        scroll();

        if (currentIndex + i >= typingText.length) {
          gameFinished();
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
      addKeyPushCount(e.key);
      addKeyTimeCount(e.key);
      setLastAnsTime(timeTyping);

      if (currentIndex + 1 >= typingText.length) {
        gameFinished();
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

  // Enter??????????????????????????????????????????????????????????????????????????????
  let currText = typingText[currentIndex];
  if (currText === "\n") currText = "??????\n";

  return (
    <>
      <div className={classes.mainContainer}>
        <Header />
        <div className={classes.container}>
          <Card className={classes.gameHeader}>
            <GameHeader
              codeLanguage={userSettings.codeLang}
              timeTyping={timeTyping}
              missCount={missCount}
              started={started}
              reset={reset}
              start={handleStart}
            />
          </Card>
          <Card className={classes.card}>
            <CardContent className={classes.cardContent} ref={scrollBox}>
              <div
                id="code-content"
                onKeyPress={(e) => handleKeyPress(e)}
                tabIndex={-1}
                className={classes.textBox}
                aria-hidden="true"
              >
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

          <div className={classes.keyboardContainer}>
            <KeyboardHand
              keyboardType={userSettings.keyboardType}
              nextKeys={nextKeys}
              leftFin={nextFinger.leftHand}
              rightFin={nextFinger.rightHand}
            />
          </div>
        </div>
      </div>
      {successModalOpen && (
        <GameFinishModal
          result={{
            speed: calSpeedKPM(typingText.length, timeTyping),
            accuracy: calAccuracy(typingText.length, missCount),
            codeTitle: userSettings.codeTitle,
            textLength: typingText.length,
          }}
          successModalOpen={successModalOpen}
        />
      )}
    </>
  );
};

export default GamePage;
