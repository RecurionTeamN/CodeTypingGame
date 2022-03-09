
import { SelectChangeEvent, Button, TextField, Stack, Box } from "@mui/material";
import React, { useState } from "react";
import MySelect from "./MySelect";
  
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '50%',
    height: '50%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
  
const languages = ["Java", "JavaScript", "Python"];

const PersonalSetting:React.FC<{
    handleChange: React.Dispatch<React.SetStateAction<{language: string, code: string}>>,
    toggle: () => void
}> = ({handleChange, toggle}) => {
    const [personalLanguage, setPesonalLanguage] = useState('');
    const [personalCode, setPersonalCode] = useState('');

    const handlePersonalLanguageChange = (event:SelectChangeEvent<string>):void => {
    setPesonalLanguage(event.target.value);
    };
    const handlePersonalCodeChange = (event:React.ChangeEvent<HTMLTextAreaElement>):void => {
    setPersonalCode(event.target.value);
    };
    return(
    <Box
        sx={style} 
        alignItems="center"
        justifyContent="center">
        <p>Personal Setting</p>
    <Stack spacing={3} paddingTop={1}>
        <MySelect
            label="Language"
            value={personalLanguage}
            options={languages}
            onchange={handlePersonalLanguageChange}
        />
        <TextField
            required
            label="Paste code here"
            value={personalCode}
            fullWidth
            margin="normal"
            rows={7}
            multiline
            variant="outlined"
            onChange={handlePersonalCodeChange}
        />
        <Button
            onClick={()=>{
                handleChange({language:personalLanguage, code:personalCode});
                toggle();
            }}
        >
            Confirm
        </Button>
    </Stack>
    </Box>
    )
}

export default PersonalSetting;