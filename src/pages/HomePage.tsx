import { Modal, SelectChangeEvent, Button, TextField, Container, Stack, Box } from "@mui/material";
import React, { useState, useRef } from "react";
import { Octokit } from "@octokit/rest";
import { Base64 } from "js-base64";
import MySelect from "../components/MySelect";
import TypingLetters from "../components/TypingLetters";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  height: "50%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const keyboards = ["Japan", "US"];
const languages = ["Java", "JavaScript", "Python"];

const HomePage = () => {
  const nameRef = useRef("");
  const codeRef = useRef("");
  const maxLenRef = useRef("");
  const personalCodeRef = useRef("");
  const githubContentRef = useRef("");

  const [keyboard, setKeyboard] = useState("");
  const [language, setLanguage] = useState("");
  const [personalLanguage, setPesonalLanguage] = useState("");
  const [githubCode, setGitHubCode] = useState("");
  const [personalSetting, setPersonalSetting] = useState({ language: "", code: "" });

  const [isOpen, setIsOpen] = useState(false);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    nameRef.current = event.target.value;
  };
  const handleCodeChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    codeRef.current = event.target.value;
  };
  const handleMaxLenChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    maxLenRef.current = event.target.value;
  };
  const handlePersonalCodeChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    personalCodeRef.current = event.target.value;
  };

  const handleKeyboardChange = (event: SelectChangeEvent<string>): void => {
    setKeyboard(event.target.value);
  };
  const handleLanguageChange = (event: SelectChangeEvent<string>): void => {
    setLanguage(event.target.value);
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
          // ①JSON 生データの確認
          console.log(response.data);
          const contentStr = JSON.stringify(response.data);

          // ②JSON.stringufy後のデータの確認
          console.log(contentStr);

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

            // ③JSON.stringify後に改行文字を消去したデータの確認
            console.log(updatedContentStr);

            // ④JSON.stringify後に改行文字を消去し、utf8にデコードしたデータの確認
            setGitHubCode(Base64.decode(updatedContentStr));
            console.log(githubContentRef.current);

            // 改行、タブの表現方法について確認するための出力
            for (let i = 0; i < Base64.decode(updatedContentStr).length; i += 1) {
              console.log(Base64.decode(updatedContentStr).charCodeAt(i));
            }
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

  return (
    <Container maxWidth="md" sx={{ pt: 5, pb: 5 }}>
      <div style={{ marginBottom: "20px" }}>
        <p>Confirm states</p>
        {`Name: ${nameRef.current}`}
        <br />
        {`KeyBoard: ${keyboard}`}
        <br />
        {`Language: ${language}`}
        <br />
        {`Code: ${codeRef.current}`}
        <br />
        {`MaxLength: ${maxLenRef.current}`}
        <br />
        {`Personal Setting: ${JSON.stringify(personalSetting)}`}
        <br />
        <p style={{ margin: 0 }}>github code: </p>
        <pre>{githubCode}</pre>
        <br />
      </div>

      <TypingLetters initLetters="Recursion Typing Game!" />
      <Stack spacing={3}>
        <TextField inputRef={nameRef} required label="Name" onChange={handleNameChange} />

        <MySelect label="Keyboard Type" value={keyboard} options={keyboards} onchange={handleKeyboardChange} />

        <MySelect label="Language" value={language} options={languages} onchange={handleLanguageChange} />

        <TextField
          inputRef={codeRef}
          required
          label="Paste code here"
          fullWidth
          margin="normal"
          rows={7}
          multiline
          variant="outlined"
          onChange={handleCodeChange}
        />

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

        <Modal
          open={isOpen}
          onClose={toggleModal}
          aria-labelledby="personal-setting-modal"
          aria-describedby="set-personal-condition"
        >
          <div>
            <Box sx={style} alignItems="center" justifyContent="center">
              <p>Personal Setting</p>
              <Stack spacing={3} paddingTop={1}>
                <MySelect
                  label="Language"
                  value={personalLanguage}
                  options={languages}
                  onchange={handlePersonalLanguageChange}
                />
                <TextField
                  inputRef={personalCodeRef}
                  required
                  label="Paste code here"
                  fullWidth
                  margin="normal"
                  rows={7}
                  multiline
                  variant="outlined"
                  onChange={handlePersonalCodeChange}
                />
                <Button
                  onClick={() => {
                    setPersonalSetting({ language: personalLanguage, code: personalCodeRef.current });
                    toggleModal();
                  }}
                >
                  Confirm
                </Button>
              </Stack>
            </Box>
          </div>
        </Modal>

        <TextField
          id="githubCode"
          inputRef={githubContentRef}
          required
          label="GitHub Code URL"
          onChange={(event) => {
            githubContentRef.current = event.target.value;
          }}
        />
        <Button
          color="secondary"
          variant="contained"
          size="small"
          onClick={() => {
            handleGithubURLChange(githubContentRef.current);
          }}
        >
          load github source code
        </Button>

        <TextField
          inputRef={maxLenRef}
          required
          type="number"
          label="Max number of letters"
          InputProps={{ inputProps: { min: 0 } }}
          onChange={handleMaxLenChange}
        />

        <Button color="primary" variant="contained" size="large">
          Let&apos;s start Game!
        </Button>
      </Stack>
    </Container>
  );
};

export default HomePage;
