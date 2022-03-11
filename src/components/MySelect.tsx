import { SelectChangeEvent, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React from "react";

type Props = {
  label: string;
  value: string;
  options: string[];
  onchange: (event: SelectChangeEvent<string>) => void;
};

const MySelect: React.VFC<Props> = ({ label, value, options, onchange }) => (
  <FormControl required>
    <InputLabel>{label}</InputLabel>
    <Select label={label.toLocaleLowerCase()} value={value} onChange={onchange}>
      {options.map((item, index) => (
        <MenuItem key={item} value={index}>
          {item}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

export default MySelect;
