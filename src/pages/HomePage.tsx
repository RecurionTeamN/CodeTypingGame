import { SelectChangeEvent, Button, TextField, Container, Stack, Box, Grid } from "@mui/material";
import React, { useState, useRef } from "react";
import { Octokit } from "@octokit/rest";
import { Base64 } from "js-base64";
import { Link } from "react-router-dom";
import MySelect from "../components/MySelect";
import HomeModal from "../components/HomeModal";
import TypingLetters from "../components/TypingLetters";
import codeData from "../utils/CodeContentData";

type LangType = typeof codeData;
type Language = keyof LangType;
type CodeContents = typeof codeData[Language];
type CodeTitles = keyof CodeContents;

const keyboards = ["Japan", "US"];
const languages: string[] = Object.keys(codeData);

const HomePage = () => {
  const nameRef = useRef("");
  const maxLenRef = useRef("");
  const personalCodeRef = useRef("");
  const githubContentRef = useRef("");

  const [keyboard, setKeyboard] = useState("");
  const [language, setLanguage] = useState("");
  const [codeOption, setCodeOption] = useState<string[]>([]);
  const [code, setCode] = useState<string>("");
  const [personalLanguage, setPesonalLanguage] = useState("");
  const [githubCode, setGitHubCode] = useState("");
  const [personalSetting, setPersonalSetting] = useState({ language: "", code: "" });

  const [isOpen, setIsOpen] = useState(false);
  const [isShowingPersonalSetting, setIsShowingPersonalSetting] = useState(false);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    nameRef.current = event.target.value;
  };
  const handleMaxLenChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    maxLenRef.current = event.target.value;
  };
  const handlePersonalCodeChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    personalCodeRef.current = event.target.value;
  };
  const handleGithubContentRefChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    githubContentRef.current = event.target.value;
  };
  const handleKeyboardChange = (event: SelectChangeEvent<string>): void => {
    setKeyboard(event.target.value);
  };
  const handleLanguageChange = (event: SelectChangeEvent<string>): void => {
    const selectedLanguage: Language = event.target.value as Language;

    // 選択された言語のデフォルトコード一覧
    const selectedCodes: CodeContents = codeData[selectedLanguage];
    const selectedCodesKeys: string[] = Object.keys(selectedCodes);

    setLanguage(event.target.value);
    // 選択された言語の初期設定コード一覧が、コード選択欄の候補として表示されるように設定する
    setCodeOption(selectedCodesKeys);

    // コードが選択済みの場合にはリセットする
    if (code !== "") {
      setCode("");
      const codeSelector = document.querySelector("#code-select");
      if (codeSelector !== null) codeSelector.childNodes[0].nodeValue = null;
    }
  };
  const handleCodeChange = (event: SelectChangeEvent<string>): void => {
    const codeOptions: CodeContents = codeData[language as Language];
    const selectedCodeTitle: CodeTitles = event.target.value as CodeTitles;
    setCode(codeOptions[selectedCodeTitle]);
  };
  const handlePersonalLanguageChange = (event: SelectChangeEvent<string>): void => {
    setPesonalLanguage(event.target.value);
  };

  const handleGithubURLChange = (baseUrl: string): void => {
    const content = () => {
      const parameters = baseUrl.split("/");
      const owner = parameters[3];
      const repo = parameters[4];
      const path = parameters.slice(7, parameters.length).join("/");

      const octokit = new Octokit();
      // octokit.repos.getContent の呼び出しに awaitを使う場合、HomePageコンポーネントをasyncで修飾する必要がある
      // ->この時の対応がわからないため暫定的にawaitを使わずthen文で対応
      octokit.repos
        .getContent({
          owner,
          repo,
          path,
        })
        .then((response) => {
          const contentStr = JSON.stringify(response.data);
          // URLがrepository内の末端ファイルを指す場合にのみ
          // jsonデータからソースコードの情報を抜き出す
          if (contentStr.indexOf('"content":"') !== -1) {
            const startIndex = contentStr.indexOf('content":"');
            const endIndex = contentStr.indexOf('","encoding');
            const shift = 'content":"'.length;
            // github api から返ってくるJSONのcontentプロパティに余分な\nが入る問題↓
            // https://superuser.com/questions/1225134/why-does-the-base64-of-a-string-contain-n
            // RFC 2045, which defined Base64, REQUIRES a newline after 76 characters (max)
            // base64が文字列変換されると、一定の文字数ごとに改行文字が入る仕様になっている
            const updatedContentStr = contentStr.substring(startIndex + shift, endIndex).replace(/\\n/g, "");

            setGitHubCode(Base64.decode(updatedContentStr));

            // eslint-disable-next-line no-alert
            alert("Code successfully obtained.");
          } else {
            // eslint-disable-next-line no-alert
            alert("format error");
          }
        })
        .catch((response) => {
          // eslint-disable-next-line no-alert
          alert(response);
        });
    };

    content();
  };

  const toggleModal = (): void => setIsOpen(!isOpen);

  const resetDefaultSetting = (): void => {
    setLanguage("");
    setCode("");
  };

  const toggleSetting = (): void => {
    setIsShowingPersonalSetting(!isShowingPersonalSetting);
  };

  return (
    <Container maxWidth="md" sx={{ pt: 5, pb: 5 }}>
      <div style={{ marginBottom: "20px" }}>
        <p>Confirm states</p>
        {/* TextFieldの値が空の時に再レンダーすると、refにコンポーネントオブジェクトが代入される。
        三項演算子を使って、refが文字列の場合のみ出力する */}
        {`Name: ${typeof nameRef.current === "string" ? nameRef.current : ""}`}
        <br />
        {`Keyboard: ${keyboard}`}
        <br />
        {`language: ${language}`}
        <br />
        {`Code (default setting): ${code}`}
        <br />
        {`Max length: ${typeof maxLenRef.current === "string" ? maxLenRef.current : ""}`}
        <br />
        {`Personal setting language: ${personalSetting.language}`}
        <br />
        Personal setting code: ↓↓↓
        <br />
        <pre>{personalSetting.code}</pre>
        <br />
      </div>

      <TypingLetters initLetters="Recursion Typing Game!" />
      <Stack spacing={3} paddingTop={2}>
        <TextField inputRef={nameRef} required label="Name" onChange={handleNameChange} />

        <MySelect label="Keyboard Type" options={keyboards} defaultVal={keyboard} onchange={handleKeyboardChange} />

        {(personalSetting.language === "" || isShowingPersonalSetting) && (
          <>
            <MySelect label="Language" options={languages} defaultVal={language} onchange={handleLanguageChange} />
            <MySelect label="Code Select" options={codeOption} defaultVal="" onchange={handleCodeChange} />
          </>
        )}

        {personalSetting.language !== "" && !isShowingPersonalSetting && (
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
          isOpen={isOpen}
          languageLabel="Language"
          languages={languages}
          personalLanguage={personalLanguage}
          personalCodeRef={personalCodeRef}
          githubContentRef={githubContentRef}
          maxLenRef={maxLenRef}
          githubCode={githubCode}
          toggleModal={toggleModal}
          handlePersonalLanguageChange={handlePersonalLanguageChange}
          handlePersonalCodeChange={handlePersonalCodeChange}
          handleMaxLenChange={handleMaxLenChange}
          handleGithubContentRefChange={handleGithubContentRefChange}
          handleGithubURLChange={handleGithubURLChange}
          resetDefaultSetting={resetDefaultSetting}
          setPersonalSetting={setPersonalSetting}
        />

        {/* デフォルトの状態ではスタートボタンのみ表示する */}
        {personalSetting.language === "" && (
          <Link to={{ pathname: "/game" }}>
            <Button color="primary" variant="contained" style={{ width: "100%" }}>
              Start Game!
            </Button>
          </Link>
        )}

        {/* personal setting が適用されている時には
        defaultのsettingを使うモードに切り替えるためのボタンを表示する */}
        {personalSetting.language !== "" && !isShowingPersonalSetting && (
          <Grid container direction="row" justifyContent="center" alignItems="center">
            <Grid item xs={5} marginRight={10}>
              <Link to={{ pathname: "/game" }}>
                <Button color="primary" variant="contained" style={{ width: "100%" }}>
                  Start Game!
                </Button>
              </Link>
            </Grid>
            <Grid item xs={5}>
              <Button color="info" variant="outlined" style={{ width: "100%" }} onClick={toggleSetting}>
                Use default setting
              </Button>
            </Grid>
          </Grid>
        )}

        {/* personal setting の情報が設定されたあとにd efault setting モードに切り替えられている場合、
         personal settingg 設定に再度切替えるためのボタンを表示する */}
        {personalSetting.language !== "" && isShowingPersonalSetting && (
          <Grid container direction="row" justifyContent="center" alignItems="center">
            <Grid item xs={5} marginRight={10}>
              <Link to={{ pathname: "/game" }}>
                <Button color="primary" variant="contained" style={{ width: "100%" }}>
                  Start Game!
                </Button>
              </Link>
            </Grid>

            <Grid item xs={5}>
              <Button color="primary" variant="outlined" style={{ width: "100%" }} onClick={toggleSetting}>
                Use personal setting
              </Button>
            </Grid>
          </Grid>
        )}
      </Stack>
    </Container>
  );
};

export default HomePage;
