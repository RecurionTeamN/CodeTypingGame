import { SelectChangeEvent, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import React, { useRef } from "react";

type Props = {
  label: string;
  options: string[];
  defaultValue?: string;
  onchange: (event: SelectChangeEvent<string>) => void;
};

const MySelect: React.VFC<Props> = ({ label, options, defaultValue = "", onchange }) => {
  const defaultRef = useRef(defaultValue);
  return (
    <FormControl required>
      <InputLabel>{label}</InputLabel>
      <Select
        key={label}
        id={label.toLocaleLowerCase().replace(" ", "-")}
        label={label.toLocaleLowerCase().replace(" ", "-")}
        defaultValue={defaultRef.current ?? ""}
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
};

export default MySelect;
