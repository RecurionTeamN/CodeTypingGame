
import {Modal, SelectChangeEvent, Button, TextField, Container, Stack, Box } from "@mui/material";
import React, { useState } from "react";
import MySelect from "../components/MySelect";
import PersonalSetting from "../components/PersonalSetting";

const keyboards = ["Japan", "US"];
const languages = ["Java", "JavaScript", "Python"];

const HomePage = ()=> {
  const [name, setName] = useState('');
  const [keyboard, setKeyboard] = useState('');
  const [language, setLanguage] = useState('');
  const [code, setCode] = useState('');
  const [maxLen, setMaxLen] = useState('');
  const [personalSetting, setPersonalSetting] = useState({language:'', code:''});
  const [isOpen, setIsOpen] = useState(false);

  const handleNameChange = (event:React.ChangeEvent<HTMLInputElement>):void => {
    setName(event.target.value);
  };
  const handleKeyboardChange = (event:SelectChangeEvent<string>):void => {
    setKeyboard(event.target.value);
  };
  const handleLanguageChange = (event:SelectChangeEvent<string>):void => {
    setLanguage(event.target.value);
  };
  const handleCodeChange = (event:React.ChangeEvent<HTMLTextAreaElement>):void => {
    setCode(event.target.value);
  };
  const handleMaxLenChange = (event:React.ChangeEvent<HTMLInputElement>):void =>{
    setMaxLen(event.target.value);
  }
  const toggleModal = ():void => setIsOpen(!isOpen);

  return (
  <Container maxWidth="sm" sx={{ pt: 3 }}>
    <div>
      <p>Confirm states</p>
      {`Name: ${name}`}<br/>
      {`KeyBoard: ${keyboard}`}<br/>
      {`Language: ${language}`}<br/>
      {`Code: ${code}`}<br/>
      {`MaxLength: ${maxLen}`}<br/>
      {`Personal Setting: ${JSON.stringify(personalSetting)}`}<br/>
    </div>

    <h1>Code Typing Game App</h1>
      <Stack spacing={3}>
        <TextField
          required
          label="Name"
          value={name}
          onChange={handleNameChange}
        />

        <MySelect
          label="Keyboard Type"
          value={keyboard}
          options={keyboards}
          onchange={handleKeyboardChange}
        />

        <MySelect
          label="Language"
          value={language}
          options={languages}
          onchange={handleLanguageChange}
        />
        
        <TextField
          required
          label="Paste code here"
          value={code}
          fullWidth
          margin="normal"
          rows={7}
          multiline
          variant="outlined"
          onChange={handleCodeChange}
        />
        
        <Box textAlign='center'>
          <Button 
            onClick={toggleModal}
            style={{
              width: '30em',
            }}
          >Personal Setting</Button>
        </Box>
        
        <Modal
          open={isOpen}
          onClose={toggleModal}
          aria-labelledby="personal-setting-modal"
          aria-describedby="set-personal-condition"
        >
          <PersonalSetting handleChange={setPersonalSetting} toggle={toggleModal}/>
        </Modal>

        <TextField 
          required
          type="number"
          value={maxLen}
          label="Max number of letters"
          InputProps={{inputProps: { min: 0}}}
          onChange={handleMaxLenChange}
        />

        <Button color="primary" variant="contained" size="large">
          Let&apos;s start Game!
        </Button>

      </Stack>
    </Container>
  )
}
                      
export default HomePage;