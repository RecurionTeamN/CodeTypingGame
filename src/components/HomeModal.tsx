import React, { useState } from "react";
import { Box, Button, Checkbox, Grid, Modal, SelectChangeEvent, Stack, TextField } from "@mui/material";
import MySelect from "./MySelect";

type Props = {
  isOpen: boolean;
  languageLabel: string;
  languages: string[];
  personalLanguage: string;
  personalCodeRef: React.MutableRefObject<string>;
  githubContentRef: React.MutableRefObject<string>;
  maxLenRef: React.MutableRefObject<string>;
  githubCode: string;
  toggleModal: () => void;
  handlePersonalLanguageChange: (event: SelectChangeEvent<string>) => void;
  handlePersonalCodeChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleMaxLenChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleGithubContentRefChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleGithubURLChange: (baseUrl: string) => void;
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
  width: "70%",
  height: "75%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const HomeModal: React.VFC<Props> = ({
  isOpen,
  languageLabel,
  languages,
  personalLanguage,
  personalCodeRef,
  githubContentRef,
  maxLenRef,
  githubCode,
  toggleModal,
  handlePersonalLanguageChange,
  handlePersonalCodeChange,
  handleMaxLenChange,
  handleGithubContentRefChange,
  handleGithubURLChange,
  resetDefaultSetting,
  setPersonalSetting,
}) => {
  // checkbox1 がオンの時 true
  const [checked, setChecked] = useState(true);

  const handleCheckedChange = () => {
    setChecked(!checked);
  };

  return (
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
            <MySelect label={languageLabel} options={languages} defaultVal="" onchange={handlePersonalLanguageChange} />

            <TextField
              inputRef={maxLenRef}
              type="number"
              label="Max number of letters"
              InputProps={{ inputProps: { min: 0 } }}
              onChange={handleMaxLenChange}
            />

            <Grid container direction="row" justifyContent="left" alignItems="center">
              <Grid item xs={1}>
                <Checkbox checked={checked} color="secondary" onClick={handleCheckedChange} />
              </Grid>
              <Grid item xs={10}>
                <TextField
                  id="paste-code-input"
                  disabled={!checked}
                  required={checked}
                  inputRef={personalCodeRef}
                  label="Paste code here"
                  fullWidth
                  margin="normal"
                  rows={7}
                  multiline
                  variant="outlined"
                  onChange={handlePersonalCodeChange}
                />
              </Grid>
            </Grid>

            <Grid container direction="row" justifyContent="left" alignItems="center">
              <Grid item xs={1}>
                <Checkbox checked={!checked} onClick={handleCheckedChange} color="secondary" />
              </Grid>
              <Grid item xs={8}>
                <TextField
                  id="github-code-URL"
                  disabled={checked}
                  required={!checked}
                  inputRef={githubContentRef}
                  label="GitHub Code URL"
                  onChange={handleGithubContentRefChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={3}>
                <Button
                  disabled={checked}
                  color="primary"
                  variant="contained"
                  size="small"
                  onClick={() => {
                    if (typeof githubContentRef.current === "string") {
                      handleGithubURLChange(githubContentRef.current);
                    }
                  }}
                  fullWidth
                  style={{ height: "55px", width: "80%", marginLeft: "10px", marginRight: "10px" }}
                >
                  Load github code
                </Button>
              </Grid>
            </Grid>

            <Button
              onClick={() => {
                let code = "";
                // ペーストによるコード入力の場合
                if (checked && personalLanguage !== "" && typeof personalCodeRef.current === "string") {
                  code = personalCodeRef.current;
                  if (typeof maxLenRef.current === "string") code = code.substring(0, parseInt(maxLenRef.current, 10));
                } // github api によるコード取得の場合
                else if (!checked && personalLanguage !== "" && githubCode !== "") {
                  code = githubCode;
                  if (typeof maxLenRef.current === "string") code = code.substring(0, parseInt(maxLenRef.current, 10));
                } else {
                  // eslint-disable-next-line no-alert
                  alert("Language and code fields must be filled.");
                  return;
                }
                setPersonalSetting({ language: personalLanguage, code });
                resetDefaultSetting();
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
