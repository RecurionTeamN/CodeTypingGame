import { SelectChangeEvent, Button, TextField, Stack, Box, Grid } from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MySelect from "./MySelect";
import HomeModal from "./HomeModal";
import TypingLetters from "./TypingLetters";
import codeData, { Language, CodeTitle } from "./CodeContentData";
import { keyboardData, KeyboardData } from "../../data/keyboardData";

const keyboards = Object.keys(keyboardData);
const languages = Object.keys(codeData);

// refactoring to match grobal state from Container Compenent

export type UserSetting = {
  userName: string;
  keyboardType: keyof KeyboardData;
  codeLang: Language;
  codeTitle: CodeTitle | "Personal Set Saved";
  codeContent: string;
};

type Props = {
  userSetting: UserSetting;
  commitSetting: React.Dispatch<React.SetStateAction<UserSetting>>;
};

const HomePage: React.FC<Props> = ({ userSetting, commitSetting }) => {
  const navigate = useNavigate();
  const [name, setName] = useState(userSetting.userName);
  const [keyboard, setKeyboard] = useState(userSetting.keyboardType);
  const [language, setLanguage] = useState<Language | string>();
  const [title, setCodeTitle] = useState<string>("");
  const [codeTitleArr, setCodeTitleArr] = useState<string[]>([]);
  const [code, setCode] = useState<string>("");
  const [personalSetting, setPersonalSetting] = useState({ language: "", code: "" });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShowingPersonalSetting, setIsShowingPersonalSetting] = useState(false);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setName(event.target.value);
  };

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
    setCode("");
  };

  const toggleSetting = (): void => {
    setIsShowingPersonalSetting(!isShowingPersonalSetting);
  };

  const startGame = (): void => {
    if (!isShowingPersonalSetting && code !== "") {
      // 必須項目が設定されている、かつ、一度も personal setting が行われていない場合
      commitSetting({
        userName: name,
        keyboardType: keyboard,
        // code!=""よりlanguageとtitleの型は保証される。
        codeLang: language as Language,
        codeTitle: title as CodeTitle,
        codeContent: code,
      });
    } else if (isShowingPersonalSetting) {
      // personal setting を使用する場合
      commitSetting({
        userName: name,
        keyboardType: keyboard,
        codeLang: personalSetting.language as Language,
        codeTitle: "Personal Set Saved",
        codeContent: personalSetting.code,
      });
    } else {
      // 必須項目が設定されていない場合
      // eslint-disable-next-line no-alert
      alert("Select keyboard type, language, and code.");
      return;
    }
    navigate("/game");
  };

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: "100vh" }}
    >
      <TypingLetters initLetters="Recursion Typing Game!" secondLetters="Hurry up !!!! Hurry up!!!!!!" />
      <Stack spacing={3} paddingTop={5}>
        <TextField label="Name" defaultValue={userSetting.userName} onChange={handleNameChange} />
        <MySelect
          label="Keyboard Type"
          options={keyboards}
          defaultValue={userSetting.keyboardType}
          onchange={handleKeyboardChange}
        />

        {/* default setting を使う場合には言語とコードの選択欄を表示する */}
        {!isShowingPersonalSetting && (
          <>
            <MySelect label="Language" options={languages} onchange={handleLanguageChange} />
            <MySelect label="Code Select" options={codeTitleArr} onchange={handleCodeChange} />
          </>
        )}

        {/* personal setting が設定されている場合には default setting 用のフォームを表示する */}
        {isShowingPersonalSetting && (
          <>
            <TextField disabled label="Language" value={personalSetting.language} />
            <TextField
              disabled
              rows={7}
              multiline
              label="Personal Code"
              value={personalSetting.code}
              style={{ opacity: 1 }}
            />
          </>
        )}

        <Box textAlign="center">
          <Button
            onClick={toggleModal}
            style={{
              width: "30em",
            }}
          >
            Personal Setting
          </Button>
        </Box>

        <HomeModal
          isModalOpen={isModalOpen}
          isShowingPersonalSetting={isShowingPersonalSetting}
          languages={languages}
          toggleModal={toggleModal}
          toggleSetting={toggleSetting}
          resetDefaultSetting={resetDefaultSetting}
          setPersonalSetting={setPersonalSetting}
        />

        {/* default setting の場合、スタートボタンのみ表示する */}
        {personalSetting.language === "" && !isShowingPersonalSetting && (
          <Button color="primary" variant="contained" style={{ width: "100%" }} onClick={startGame}>
            Start Game!
          </Button>
        )}

        {/* personal setting が適用されている場合、
        default setting を使うモードに切り替えるためのボタンを表示する */}
        {personalSetting.language !== "" && isShowingPersonalSetting && (
          <Grid container direction="row" justifyContent="center" alignItems="center">
            <Grid item xs={6} paddingX={2}>
              <Button color="primary" variant="contained" style={{ width: "100%", height: "45px" }} onClick={startGame}>
                Start Game!
              </Button>
            </Grid>
            <Grid item xs={6} paddingX={2}>
              <Button color="info" variant="outlined" style={{ width: "100%", height: "45px" }} onClick={toggleSetting}>
                Use default setting
              </Button>
            </Grid>
          </Grid>
        )}

        {/* personal setting の情報が設定されたあとに default setting モードに切り替えられている場合、
         personal setting 設定に再度切替えるためのボタンを表示する */}
        {personalSetting.language !== "" && !isShowingPersonalSetting && (
          <Grid container direction="row" justifyContent="center" alignItems="center">
            <Grid item xs={6} paddingX={2}>
              <Button color="primary" variant="contained" style={{ width: "100%", height: "45px" }} onClick={startGame}>
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
                Use personal setting
              </Button>
            </Grid>
          </Grid>
        )}
      </Stack>
    </Grid>
  );
};

export default HomePage;
