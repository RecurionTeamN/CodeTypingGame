import { Modal, SelectChangeEvent, Button, TextField, Container, Stack, Box } from "@mui/material";
import React, { useState, useRef } from "react";
import { detect } from "program-language-detector";
import MySelect from "../components/MySelect";

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

const HomePage = () => {
  const nameRef = useRef("");
  const codeRef = useRef("");
  const personalCodeRef = useRef("");
  const languageRef = useRef("");
  const personalLanguageRef = useRef("");
  const maxLenRef = useRef("");

  const [keyboard, setKeyboard] = useState("");
  const [personalSetting, setPersonalSetting] = useState({ language: "", code: "" });

  const [isOpen, setIsOpen] = useState(false);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    nameRef.current = event.target.value;
  };
  const handleCodeChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    codeRef.current = event.target.value;
    languageRef.current = detect(event.target.value);
  };
  const handleMaxLenChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    maxLenRef.current = event.target.value;
  };
  const handlePersonalCodeChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    personalCodeRef.current = event.target.value;
    personalLanguageRef.current = detect(event.target.value);
  };

  const handleKeyboardChange = (event: SelectChangeEvent<string>): void => {
    setKeyboard(event.target.value);
  };

  const toggleModal = (): void => setIsOpen(!isOpen);

  return (
    <Container maxWidth="sm" sx={{ pt: 3 }}>
      <div>
        <p>Confirm states</p>
        {`Name: ${nameRef.current}`}
        <br />
        {`KeyBoard: ${keyboard}`}
        <br />
        {`Language: ${languageRef.current}`}
        <br />
        {`Code: ${codeRef.current}`}
        <br />
        {`MaxLength: ${maxLenRef.current}`}
        <br />
        {`Personal Setting: ${JSON.stringify(personalSetting)}`}
        <br />
      </div>

      <h1>Code Typing Game App</h1>
      <Stack spacing={3}>
        <TextField inputRef={nameRef} required label="Name" onChange={handleNameChange} />

        <MySelect label="Keyboard Type" value={keyboard} options={keyboards} onchange={handleKeyboardChange} />

        {/* <MySelect
          label="Language"
          value={language}
          options={languages}
          onchange={handleLanguageChange}
        /> */}

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
          <Box sx={style} alignItems="center" justifyContent="center">
            <p>Personal Setting</p>
            <Stack spacing={3} paddingTop={1}>
              {/* <MySelect
                label="Language"
                  value={personalLanguage}
                  options={languages}
                  onchange={handlePersonalLanguageChange}
              /> */}
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
                  setPersonalSetting({ language: personalLanguageRef.current, code: personalCodeRef.current });
                  toggleModal();
                }}
              >
                Confirm
              </Button>
            </Stack>
          </Box>
        </Modal>

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
