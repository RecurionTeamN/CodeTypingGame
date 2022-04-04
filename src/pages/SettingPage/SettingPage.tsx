import { SelectChangeEvent, Button, TextField, Stack, Box, Grid } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import theme from "../../styles/Theme";
import MySelect from "./MySelect";
import SettingModal from "./SettingModal";
import { keyboardData, KeyData } from "../../data/keyboardData";
import useProfileContext from "../../hooks/useProfileContext";
import { codeLanguages, CodeLangTypes, KeyboardTypes } from "../../context/profile/types";
import Header from "../../components/Header";
import fetchCodesDocs from "../../firebase/utils/fetchCodesDocs";
import { CodesDocument } from "../../firebase/Codes/types";

const keyboards = Object.keys(keyboardData) as KeyboardTypes[];
const languages = codeLanguages;

type Props = {
  setCurrGameData: React.Dispatch<
    React.SetStateAction<{
      speed: number;
      accuracy: number;
      keyData: KeyData;
    }>
  >;
};

const SettingPage: React.FC<Props> = ({ setCurrGameData }) => {
  const { profileState, dispatch: profileDispatch } = useProfileContext();
  const { userSettings } = profileState;
  const navigate = useNavigate();

  const [keyboard, setKeyboard] = useState(userSettings.keyboardType);
  const [language, setLanguage] = useState<CodeLangTypes>(userSettings.codeLang);
  const [codeDocuments, setCodeDocuments] = useState<CodesDocument[]>();
  const [codeTitle, setCodeTitle] = useState<string>("");
  const [codeTitleArr, setCodeTitleArr] = useState<string[]>([]);
  const [code, setCode] = useState<string>("");
  const [additionalSetting, setAdditionalSetting] = useState({ language: "", code: "" });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isShowingAdditionalSetting, setIsShowingAdditionalSetting] = useState(false);

  useEffect(() => {
    try {
      const getCodeDocuments = async () => {
        const results = await fetchCodesDocs(language);
        setCodeDocuments(results);
        setCodeTitleArr(results.map((doc) => doc.codeTitle));
      };
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      getCodeDocuments();
    } catch (err) {
      toast.error((err as Error).message);
    }
  }, [language]);

  const handleKeyboardChange = (event: SelectChangeEvent<string>): void => {
    setKeyboard(event.target.value as KeyboardTypes);
  };

  const handleLanguageChange = (event: SelectChangeEvent<string>): void => {
    setLanguage(event.target.value as CodeLangTypes);
    setCodeTitle("");
    setCode("");
    const codeSelector = document.querySelector("#code-select");
    if (codeSelector !== null) {
      codeSelector.childNodes[0].nodeValue = null;
    }
  };

  const handleCodeChange = (event: SelectChangeEvent<string>): void => {
    setCodeTitle(event.target.value);
    if (codeDocuments) {
      setCode(codeDocuments.filter((doc) => doc.codeTitle === event.target.value)[0].codeContent);
    }
  };

  const toggleModal = (): void => setIsModalOpen(!isModalOpen);

  const resetDefaultSetting = (): void => {
    setLanguage(userSettings.codeLang);
    setCodeTitle("");
    setCodeTitleArr([]);
    setCode("");
  };

  const toggleSetting = (): void => {
    setIsShowingAdditionalSetting(!isShowingAdditionalSetting);
    resetDefaultSetting();
  };

  const startGame = (): void => {
    if (!isShowingAdditionalSetting && language && codeDocuments) {
      setCurrGameData({
        speed: 0,
        accuracy: 0,
        keyData: keyboardData[keyboard],
      });
      if (code === "") {
        // コードタイトルが選択されていない場合、ランダムなコードでゲーム開始
        const randomCode = codeDocuments[Math.floor(Math.random() * codeDocuments.length)];
        profileDispatch({
          type: "SET_USERSETTINGS",
          payload: {
            keyboardType: keyboard,
            codeLang: language,
            codeTitle: randomCode.codeTitle,
            codeContent: randomCode.codeContent,
          },
        });
      } else {
        // コードタイトルが選択されている場合
        profileDispatch({
          type: "SET_USERSETTINGS",
          payload: {
            keyboardType: keyboard,
            codeLang: language,
            codeTitle,
            codeContent: code,
          },
        });
      }
    } else if (isShowingAdditionalSetting) {
      setCurrGameData({
        speed: 0,
        accuracy: 0,
        keyData: keyboardData[keyboard],
      });
      profileDispatch({
        type: "SET_USERSETTINGS",
        payload: {
          keyboardType: keyboard,
          codeLang: additionalSetting.language as CodeLangTypes,
          codeTitle: "",
          codeContent: additionalSetting.code,
        },
      });
    } else {
      // 必須項目が設定されていない場合
      toast.error("必須項目が選択されていません。");
      return;
    }
    navigate("/game");
  };

  return (
    <div style={{ height: "100vh" }}>
      <Header />
      <Box sx={{ height: "80%", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Stack spacing={3} sx={{ height: "100%", width: "50%", justifyContent: "center" }}>
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
              <MySelect
                label="Language"
                options={languages}
                onchange={handleLanguageChange}
                defaultValue={userSettings.codeLang}
              />
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
                width: "100%",
                marginTop: "2rem",
                marginBottom: "1rem",
              }}
            >
              追加設定を編集する
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
                  追加設定を無効化
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
      </Box>
    </div>
  );
};

export default SettingPage;
