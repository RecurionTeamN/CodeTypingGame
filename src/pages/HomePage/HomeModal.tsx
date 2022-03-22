import React, { useState, useRef } from "react";
import { Box, Button, Modal, SelectChangeEvent, Stack, TextField } from "@mui/material";
import { Octokit } from "@octokit/rest";
import { Base64 } from "js-base64";
import MySelect from "./MySelect";
import PersonalCodeImport from "./PersonalCodeImport";

type Props = {
  isModalOpen: boolean;
  languages: string[];
  toggleModal: () => void;
  toggleSetting: () => void;
  resetDefaultSetting: () => void;
  setPersonalSetting: (
    value: React.SetStateAction<{
      language: string;
      code: string;
    }>
  ) => void;
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "50%",
  height: "70%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const HomeModal: React.VFC<Props> = ({
  isModalOpen,
  languages,
  toggleModal,
  toggleSetting,
  resetDefaultSetting,
  setPersonalSetting,
}) => {
  // コードペーストモードがオンの時 true
  const [personalLanguage, setPesonalLanguage] = useState("");
  const [isCodePasteMode, setIsCodePasteMode] = useState(true);
  const [githubCode, setGitHubCode] = useState("");
  const maxLenRef = useRef("");
  const personalCodeRef = useRef("");
  const githubContentRef = useRef("");

  const handleCheckeBoxSwitch = (): void => {
    setIsCodePasteMode(!isCodePasteMode);
  };

  const handleMaxLenChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    maxLenRef.current = event.target.value;
  };

  const handlePersonalLanguageChange = (event: SelectChangeEvent<string>): void => {
    setPesonalLanguage(event.target.value);
  };

  const handlePersonalCodeChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    personalCodeRef.current = event.target.value;
  };

  const handleGithubContentRefChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    githubContentRef.current = event.target.value;
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

  return (
    <Modal
      open={isModalOpen}
      onClose={toggleModal}
      aria-labelledby="personal-setting-modal"
      aria-describedby="set-personal-condition"
    >
      <div>
        <Box sx={style} alignItems="center" justifyContent="center">
          <p>Personal Setting</p>
          <Stack spacing={3} paddingTop={1}>
            <MySelect label="Language" options={languages} onchange={handlePersonalLanguageChange} />

            <TextField
              inputRef={maxLenRef}
              type="number"
              label="Max number of letters"
              InputProps={{ inputProps: { min: 0 } }}
              onChange={handleMaxLenChange}
            />

            <PersonalCodeImport
              personalCodeRef={personalCodeRef}
              githubContentRef={githubContentRef}
              isCodePasteMode={isCodePasteMode}
              handleCheckeBoxSwitch={handleCheckeBoxSwitch}
              handlePersonalCodeChange={handlePersonalCodeChange}
              handleGithubContentRefChange={handleGithubContentRefChange}
              handleGithubURLChange={handleGithubURLChange}
            />

            <Button
              onClick={() => {
                let code = "";
                // ペーストによるコード入力の場合
                if (isCodePasteMode && personalLanguage !== "" && typeof personalCodeRef.current === "string") {
                  code = personalCodeRef.current;
                  if (typeof maxLenRef.current === "string") code = code.substring(0, parseInt(maxLenRef.current, 10));
                } // github api によるコード取得の場合
                else if (!isCodePasteMode && personalLanguage !== "" && githubCode !== "") {
                  code = githubCode;
                  if (typeof maxLenRef.current === "string") code = code.substring(0, parseInt(maxLenRef.current, 10));
                } else {
                  // eslint-disable-next-line no-alert
                  alert("Language and code fields must be filled.");
                  return;
                }
                setPersonalSetting({ language: personalLanguage, code });
                resetDefaultSetting();
                toggleSetting();
                toggleModal();
              }}
            >
              Confirm
            </Button>
          </Stack>
        </Box>
      </div>
    </Modal>
  );
};

export default HomeModal;
