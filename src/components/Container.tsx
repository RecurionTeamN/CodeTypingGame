import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/styles";
import theme from "../styles/Theme";
import GamePage from "../pages/GamePage/GamePage";
import HomePage, { UserSetting } from "../pages/HomePage/HomePage";
import ResultPage from "../pages/ResultPage/ResultPage";
import { KeyboardData, keyboardData } from "../data/keyboardData";
import CodeContentData, { Language, CodeTitle } from "../pages/HomePage/CodeContentData";

const Container = () => {
  // まず、Firebseからデータ(構造はまだ不明なので仮)を取得した形でゲーム中のstateを作っていく。
  type UserDataFromServer = {
    userName: string;
    keyboardType: keyof KeyboardData;
    codeLang: Language;
    codeTitle: CodeTitle | "Personal Set Saved";
    codeContent: string;
    gameHistory: [{ date: string; results: [{ speed: number; accuracy: number }] }];
    bestScores: {
      [keyName in keyof typeof CodeContentData]: {
        speed: number;
        accuracy: number;
      };
    };
  };

  const dummyUserDataFromServer: UserDataFromServer = {
    userName: "testUser",
    keyboardType: "mac-jis",
    codeLang: "Python",
    codeTitle: "title1",
    codeContent: "Python content 1",
    gameHistory: [
      {
        date: "2022/03/01",
        results: [
          {
            speed: 0,
            accuracy: 0,
          },
        ],
      },
    ],
    bestScores: {
      Java: {
        accuracy: 0,
        speed: 0,
      },
      JavaScript: {
        accuracy: 0,
        speed: 0,
      },
      Python: {
        accuracy: 0,
        speed: 0,
      },
    },
  };

  // ここから各ページで利用するstateを記述。
  const [userSetting, setUserSetting] = useState<UserSetting>({
    userName: dummyUserDataFromServer.userName,
    keyboardType: dummyUserDataFromServer.keyboardType,
    codeLang: dummyUserDataFromServer.codeLang,
    codeTitle: dummyUserDataFromServer.codeTitle,
    codeContent: dummyUserDataFromServer.codeContent,
  });

  const [gameData, setGameData] = useState({
    speed: 0,
    accuracy: 0,
    keyData: keyboardData[userSetting.keyboardType],
  });

  const [pastGameData, setPastGame] = useState({
    history: dummyUserDataFromServer.gameHistory,
    bestScores: dummyUserDataFromServer.bestScores,
  });

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage userSetting={userSetting} commitSetting={setUserSetting} />} />
          <Route
            path="/game"
            element={<GamePage codeContent={userSetting.codeContent} gameData={gameData} commitResult={setGameData} />}
          />
          <Route
            path="/results"
            element={
              <ResultPage language={userSetting.codeLang} gameData={gameData} bestScores={pastGameData.bestScores} />
            }
          />

          {/* <Route path="*" element={<404Page />} /> */}
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default Container;
