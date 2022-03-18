import { SelectChangeEvent, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React from "react";

type Props = {
  label: string;
  options: string[];
  defaultVal: string;
  onchange: (event: SelectChangeEvent<string>) => void;
};

const MySelect: React.VFC<Props> = ({ label, options, defaultVal, onchange }) => (
  <FormControl required>
    <InputLabel>{label}</InputLabel>
    <Select label={label.toLocaleLowerCase()} defaultValue="" onChange={onchange}>
      {options.map((item, index) => (
        <MenuItem key={item} value={item}>
          {item}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

export default MySelect;
