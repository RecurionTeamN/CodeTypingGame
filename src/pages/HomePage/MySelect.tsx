import { SelectChangeEvent, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React from "react";

type Props = {
  label: string;
  options: string[];
  defaultValue?: string;
  onchange: (event: SelectChangeEvent<string>) => void;
};

const MySelect: React.VFC<Props> = ({ label, options, defaultValue = "", onchange }) => (
  <FormControl required>
    <InputLabel>{label}</InputLabel>
    <Select
      id={label.toLocaleLowerCase().replace(" ", "-")}
      label={label.toLocaleLowerCase().replace(" ", "-")}
      defaultValue={defaultValue}
      onChange={onchange}
    >
      {options.map((item) => (
        <MenuItem key={item} value={item}>
          {item}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

export default MySelect;
