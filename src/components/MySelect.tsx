
import { SelectChangeEvent, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React from "react";

type SelectPropsType = {
  label: string,
  value: string,
  options: string[],
  onchange: (event:SelectChangeEvent<string>) => void
}

const MySelect = (props:SelectPropsType) => {
  const {label, value, options, onchange} = props;
  return(
    <FormControl required>
      <InputLabel >{label}</InputLabel>
      <Select
        value={value}
        label={label.toLocaleLowerCase()}
        onChange={onchange}
      >
        {options.map((item, index) => <MenuItem key={item} value={index}>{item}</MenuItem>)}
      </Select>
    </FormControl>
    )
  }

  export default MySelect;