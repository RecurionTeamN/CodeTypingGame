import { SelectChangeEvent, Button, TextField, Stack, Box, Grid } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import theme from "../../styles/Theme";
import MySelect from "./MySelect";
import SettingModal from "./SettingModal";
import TypingLetters from "./TypingLetters";
import codeData, { Language, CodeTitle } from "./CodeContentData";
import { keyboardData, KeyboardData } from "../../data/keyboardData";
import useProfileContext from "../../hooks/useProfileContext";
import { codeLanguages, CodeLangTypes, KeyboardTypes } from "../../context/profile/types";
import Header from "../../components/Header";

const keyboards = Object.keys(keyboardData);
const languages = codeLanguages;

const SettingPage = () => {
  const { profileState, dispatch: profileDispatch } = useProfileContext();
  const { userSettings } = profileState;
  const navigate = useNavigate();

  const [keyboard, setKeyboard] = useState(userSettings.keyboardType);
  const [language, setLanguage] = useState<Language | string>("");
  const [codeTitle, setCodeTitle] = useState<string>("");
  const [codeTitleArr, setCodeTitleArr] = useState<string[]>([]);
  const [code, setCode] = useState<string>("");
  const [additionalSetting, setAdditionalSetting] = useState({ language: "", code: "" });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShowingAdditionalSetting, setIsShowingAdditionalSetting] = useState(false);

  const handleKeyboardChange = (event: SelectChangeEvent<string>): void => {
    setKeyboard(event.target.value as keyof KeyboardData);
  };

  const handleLanguageChange = (event: SelectChangeEvent<string>): void => {
    setLanguage(event.target.value as Language);
    setCodeTitle("");
    setCode("");
    setCodeTitleArr(Object.keys(codeData[event.target.value as Language]));
    const codeSelector = document.querySelector("#code-select");
    if (codeSelector !== null) {
      codeSelector.childNodes[0].nodeValue = null;
    }
  };

  const handleCodeChange = (event: SelectChangeEvent<string>): void => {
    setCodeTitle(event.target.value as CodeTitle);
    setCode(codeData[language as Language][event.target.value as CodeTitle]);
  };

  const toggleModal = (): void => setIsModalOpen(!isModalOpen);

  const resetDefaultSetting = (): void => {
    setLanguage("");
    setCodeTitle("");
    setCodeTitleArr([]);
    setCode("");
  };

  const toggleSetting = (): void => {
    setIsShowingAdditionalSetting(!isShowingAdditionalSetting);
    resetDefaultSetting();
  };

  const startGame = (): void => {
    if (!isShowingAdditionalSetting && language !== "") {
      if (code === "") {
        const randomTitile = codeTitleArr[Math.floor(Math.random() * codeTitleArr.length)] as CodeTitle;
        profileDispatch({
          type: "SET_USERSETTINGS",
          payload: {
            keyboardType: keyboard as KeyboardTypes,
            codeLang: language as CodeLangTypes,
            codeTitle: randomTitile,
            codeContent: codeData[language as Language][randomTitile],
          },
        });
      } else
        profileDispatch({
          type: "SET_USERSETTINGS",
          payload: {
            keyboardType: keyboard as KeyboardTypes,
            codeLang: language as CodeLangTypes,
            codeTitle,
            codeContent: code,
          },
        });
      toast.success("Saved user settings!");
    } else if (isShowingAdditionalSetting) {
      profileDispatch({
        type: "SET_USERSETTINGS",
        payload: {
          keyboardType: keyboard as KeyboardTypes,
          codeLang: additionalSetting.language as CodeLangTypes,
          codeTitle: "Additional Set Saved",
          codeContent: additionalSetting.code,
        },
      });
      toast.success("Saved user settings!");
    } else {
      // 必須項目が設定されていない場合
      toast.error("必須項目が選択されていません。");
      return;
    }
    navigate("/game");
  };

  return (
    <div>
      <Header />
      <Grid container spacing={0} direction="column" alignItems="center" justifyContent="center">
        <TypingLetters initLetters="Recursion Typing Game!" secondLetters="Hurry up !!!! Hurry up!!!!!!" />
        <Stack spacing={3} paddingTop={5}>
          <Box sx={{ color: theme.palette.error.main }}>※必須項目：お使いのキーボードを選択下さい。</Box>
          <MySelect
            label="Keyboard Type"
            options={keyboards}
            defaultValue={userSettings.keyboardType}
            onchange={handleKeyboardChange}
          />

          {/* default setting を使う場合には言語とコードの選択欄を表示する */}
          {!isShowingAdditionalSetting && (
            <>
              <Box sx={{ color: theme.palette.error.main }}>※必須項目：練習したいプログラミング言語を選択下さい。</Box>
              <MySelect label="Language" options={languages} onchange={handleLanguageChange} />
              <Box sx={{ color: theme.palette.success.main }}>
                任意項目：練習したいコードを選択下さい。未選択時は言語を元にランダムなコードを使用します。
              </Box>
              <MySelect label="Code Select" options={codeTitleArr} onchange={handleCodeChange} />
            </>
          )}

          {/* additional setting が設定されている場合には default setting 用のフォームを表示する */}
          {isShowingAdditionalSetting && (
            <>
              <TextField disabled label="Language" value={additionalSetting.language} />
              <TextField
                disabled
                rows={7}
                multiline
                label="additional Code"
                value={additionalSetting.code}
                style={{ opacity: 1 }}
              />
            </>
          )}
          <Box sx={{ color: theme.palette.success.main }}>
            追加設定でオリジナルのコードやGitHubからコードをimportして使用できます。
          </Box>
          <Box textAlign="center">
            <Button
              onClick={toggleModal}
              style={{
                width: "30em",
              }}
            >
              追加設定を表示
            </Button>
          </Box>

          <SettingModal
            isModalOpen={isModalOpen}
            isShowingAdditionalSetting={isShowingAdditionalSetting}
            languages={languages}
            toggleModal={toggleModal}
            toggleSetting={toggleSetting}
            resetDefaultSetting={resetDefaultSetting}
            setAdditionalSetting={setAdditionalSetting}
          />

          {/* default setting の場合、スタートボタンのみ表示する */}
          {additionalSetting.language === "" && !isShowingAdditionalSetting && (
            <Button color="primary" variant="contained" style={{ width: "100%" }} onClick={startGame}>
              Start Game!
            </Button>
          )}

          {/* additional setting が適用されている場合、
          default setting を使うモードに切り替えるためのボタンを表示する */}
          {additionalSetting.language !== "" && isShowingAdditionalSetting && (
            <Grid container direction="row" justifyContent="center" alignItems="center">
              <Grid item xs={6} paddingX={2}>
                <Button
                  color="primary"
                  variant="contained"
                  style={{ width: "100%", height: "45px" }}
                  onClick={startGame}
                >
                  Start Game!
                </Button>
              </Grid>
              <Grid item xs={6} paddingX={2}>
                <Button
                  color="info"
                  variant="outlined"
                  style={{ width: "100%", height: "45px" }}
                  onClick={toggleSetting}
                >
                  デフォルト設定を適応
                </Button>
              </Grid>
            </Grid>
          )}

          {/* additional setting の情報が設定されたあとに default setting モードに切り替えられている場合、
          additional setting 設定に再度切替えるためのボタンを表示する */}
          {additionalSetting.language !== "" && !isShowingAdditionalSetting && (
            <Grid container direction="row" justifyContent="center" alignItems="center">
              <Grid item xs={6} paddingX={2}>
                <Button
                  color="primary"
                  variant="contained"
                  style={{ width: "100%", height: "45px" }}
                  onClick={startGame}
                >
                  Start Game!
                </Button>
              </Grid>

              <Grid item xs={6} paddingX={2}>
                <Button
                  color="primary"
                  variant="outlined"
                  style={{ width: "100%", height: "45px" }}
                  onClick={toggleSetting}
                >
                  追加設定を適用
                </Button>
              </Grid>
            </Grid>
          )}
        </Stack>
      </Grid>
    </div>
  );
};

export default SettingPage;
