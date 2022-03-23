import { SelectChangeEvent, Button, TextField, Stack, Box, Grid } from "@mui/material";
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import MySelect from "./MySelect";
import HomeModal from "./HomeModal";
import TypingLetters from "./TypingLetters";
import defaultContent from "../../data/DefaultCodeContent";

type LangType = typeof defaultContent;
type Language = keyof LangType;
type CodeContents = typeof defaultContent[Language];
type CodeTitles = keyof CodeContents;

const keyboards = ["Japan", "US"];
const languages: string[] = Object.keys(defaultContent);

const HomePage = () => {
  const navigate = useNavigate();

  const nameRef = useRef("");
  const [keyboard, setKeyboard] = useState("");
  const [language, setLanguage] = useState("");
  const [codeOption, setCodeOption] = useState<string[]>([]);
  const [code, setCode] = useState<string>("");
  const [personalSetting, setPersonalSetting] = useState({ language: "", code: "" });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShowingPersonalSetting, setIsShowingPersonalSetting] = useState(false);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    nameRef.current = event.target.value;
  };

  const handleKeyboardChange = (event: SelectChangeEvent<string>): void => {
    setKeyboard(event.target.value);
  };

  const handleLanguageChange = (event: SelectChangeEvent<string>): void => {
    const selectedLanguage: Language = event.target.value as Language;

    // 選択された言語のデフォルトコード一覧
    const selectedCodes: CodeContents = defaultContent[selectedLanguage];
    const selectedCodesKeys: string[] = Object.keys(selectedCodes);

    setLanguage(event.target.value);
    // 選択された言語の初期設定コード一覧が、コード選択欄の候補として表示されるように設定する
    setCodeOption(selectedCodesKeys);

    // コードが選択済みの場合にはリセットする
    if (code !== "") {
      setCode("");
      const codeSelector = document.querySelector("#code-select");
      if (codeSelector !== null) {
        codeSelector.childNodes[0].nodeValue = null;
      }
    }
  };

  const handleCodeChange = (event: SelectChangeEvent<string>): void => {
    const codeOptions: CodeContents = defaultContent[language as Language];
    const selectedCodeTitle: CodeTitles = event.target.value as CodeTitles;
    setCode(codeOptions[selectedCodeTitle]);
  };

  const toggleModal = (): void => setIsModalOpen(!isModalOpen);

  const resetDefaultSetting = (): void => {
    setLanguage("");
    setCode("");
  };

  const toggleSetting = (): void => {
    setIsShowingPersonalSetting(!isShowingPersonalSetting);
  };

  const startGame = (): void => {
    if (personalSetting.language === "" && language !== "" && code !== "" && keyboard !== "") {
      // 必須項目が設定されている、かつ、一度も personal setting が行われていない場合
      navigate("/game", { state: { language, code, keyboard } });
    } else if (isShowingPersonalSetting && keyboard !== "" && language === "" && code === "") {
      // personal setting を使用する場合
      navigate("/game", { state: { language: personalSetting.language, code: personalSetting.code, keyboard } });
    } else if (personalSetting.language !== "" && !isShowingPersonalSetting && language !== "" && code !== "") {
      // personal setting が設定された後に default setting に切り替えた場合
      navigate("/game", { state: { language: personalSetting.language, code: personalSetting.code, keyboard } });
    } else {
      // 必須項目が設定されていない場合
      // eslint-disable-next-line no-alert
      alert("Select keyboard type, language, and code.");
    }
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
        <TextField inputRef={nameRef} label="Name" onChange={handleNameChange} />
        <MySelect label="Keyboard Type" options={keyboards} onchange={handleKeyboardChange} />

        {/* 画面遷移直後 または default setting を使う場合には言語とコードの選択欄を表示する */}
        {!isShowingPersonalSetting && personalSetting.language === "" && (
          <>
            <MySelect label="Language" options={languages} onchange={handleLanguageChange} />
            <MySelect label="Code Select" options={codeOption} onchange={handleCodeChange} />
          </>
        )}

        {/* personal setting が設定されている場合には default setting 用のフォームを表示する */}
        {personalSetting.language !== "" && (
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

        {/* 画面遷移直後の状態または default setting の場合、スタートボタンのみ表示する */}
        {personalSetting.language === "" && !isShowingPersonalSetting && (
          <Button color="primary" variant="contained" style={{ width: "100%" }} onClick={startGame}>
            Start Game!
          </Button>
        )}

        {/* personal setting が適用されている場合、
        default setting を使うモードに切り替えるためのボタンを表示する */}
        {personalSetting.language !== "" && !isShowingPersonalSetting && (
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
        {personalSetting.language !== "" && isShowingPersonalSetting && (
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
