import React, { useState, useRef } from "react";
import { Box, Button, Modal, SelectChangeEvent, Stack, TextField } from "@mui/material";
import { Octokit } from "@octokit/rest";
import { Base64 } from "js-base64";
import { toast } from "react-toastify";
import MySelect from "./MySelect";
import PersonalCodeImport from "./PersonalCodeImport";
import theme from "../../styles/Theme";

type Props = {
  isModalOpen: boolean;
  isShowingAdditionalSetting: boolean;
  languages: string[];
  toggleModal: () => void;
  toggleSetting: () => void;
  resetDefaultSetting: () => void;
  setAdditionalSetting: (
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

const SettingModal: React.VFC<Props> = ({
  isModalOpen,
  isShowingAdditionalSetting,
  languages,
  toggleModal,
  toggleSetting,
  resetDefaultSetting,
  setAdditionalSetting,
}) => {
  // コードペーストモードがオンの時 true
  const [additionalLanguage, setAdditionalLanguage] = useState("");
  const [isCodePasteMode, setIsCodePasteMode] = useState(true);
  const [githubCode, setGitHubCode] = useState("");
  const maxLenRef = useRef("");
  const additionalCodeRef = useRef("");
  const githubContentRef = useRef("");

  const handleCheckeBoxSwitch = (): void => {
    setIsCodePasteMode(!isCodePasteMode);
  };

  const handleMaxLenChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    maxLenRef.current = event.target.value;
  };

  const handleAdditionalLanguageChange = (event: SelectChangeEvent<string>): void => {
    setAdditionalLanguage(event.target.value);
  };

  const handleAdditionalCodeChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    additionalCodeRef.current = event.target.value;
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

            toast.success("Code successfully obtained.");
          } else {
            toast.error("format error");
          }
        })
        .catch((err) => {
          toast.error((err as Error).message);
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
          <Box>
            <strong>追加設定：コードをペースト又はGitHubからimportして使用できます。</strong>
          </Box>
          <Stack spacing={3} paddingTop={1}>
            <Box sx={{ color: theme.palette.error.main }}>
              ※必須項目：設定されるコードのプログラミング言語を選択下さい。
            </Box>
            <MySelect label="Language" options={languages} onchange={handleAdditionalLanguageChange} />
            <Box sx={{ color: theme.palette.success.main }}>
              任意項目：使用するコードの長さを制限することができます。
            </Box>
            <TextField
              inputRef={maxLenRef}
              type="number"
              label="Max number of letters"
              InputProps={{ inputProps: { min: 0 } }}
              onChange={handleMaxLenChange}
            />

            <PersonalCodeImport
              additionalCodeRef={additionalCodeRef}
              githubContentRef={githubContentRef}
              isCodePasteMode={isCodePasteMode}
              handleCheckeBoxSwitch={handleCheckeBoxSwitch}
              handleAdditionalCodeChange={handleAdditionalCodeChange}
              handleGithubContentRefChange={handleGithubContentRefChange}
              handleGithubURLChange={handleGithubURLChange}
            />

            <Button
              onClick={() => {
                let code = "";
                // ペーストによるコード入力の場合
                if (isCodePasteMode && additionalLanguage !== "" && typeof additionalCodeRef.current === "string") {
                  code = additionalCodeRef.current;
                  if (typeof maxLenRef.current === "string") code = code.substring(0, parseInt(maxLenRef.current, 10));
                } // github api によるコード取得の場合
                else if (!isCodePasteMode && additionalLanguage !== "" && githubCode !== "") {
                  code = githubCode;
                  if (typeof maxLenRef.current === "string") code = code.substring(0, parseInt(maxLenRef.current, 10));
                } else {
                  toast.error("必須項目を選択の上、コードをペースト又は有効なGitHub URLを記入下さい。");
                  return;
                }
                setAdditionalSetting({ language: additionalLanguage, code });
                resetDefaultSetting();
                if (!isShowingAdditionalSetting) toggleSetting();
                toggleModal();
              }}
            >
              設定を保存
            </Button>
          </Stack>
        </Box>
      </div>
    </Modal>
  );
};

export default SettingModal;
