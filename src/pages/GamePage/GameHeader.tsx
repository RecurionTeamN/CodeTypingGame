import React from "react";
import { AppBar, Typography, Box, Toolbar, Button, Theme } from "@mui/material";
import { makeStyles } from "@mui/styles";
import {
  SiTypescript,
  SiJavascript,
  SiPython,
  SiGo,
  SiJava,
  SiKotlin,
  SiPhp,
  SiCsharp,
  SiSwift,
  SiR,
  SiRuby,
  SiCplusplus,
} from "react-icons/si";
import formatTime from "../../utils/formatTime";
import { CodeLangTypes } from "../../context/profile/types";

type Props = {
  codeLanguage: CodeLangTypes;
  timeTyping: number;
  missCount: number;
  reset: () => void;
};

type CodeLanguageIconsType = {
  [keyName in CodeLangTypes]: JSX.Element;
};

const codeLanguageIcons: CodeLanguageIconsType = {
  Typescript: <SiTypescript size={30} />,
  Javascript: <SiJavascript size={30} />,
  Python: <SiPython size={30} />,
  Go: <SiGo size={30} />,
  Java: <SiJava size={30} />,
  Kotlin: <SiKotlin size={30} />,
  Php: <SiPhp size={30} />,
  "C#": <SiCsharp size={30} />,
  "C++": <SiCplusplus size={30} />,
  Swift: <SiSwift size={30} />,
  Ruby: <SiRuby size={30} />,
  R: <SiR size={30} />,
};

const useStyles = makeStyles((theme: Theme) => ({
  appbar: {
    backgroundColor: theme.palette.grey[800],
  },
  codeLanguageContainer: {
    display: "flex",
    alignItems: "center",
  },
}));

const GameHeader: React.VFC<Props> = ({ codeLanguage, timeTyping, missCount, reset }) => {
  const classes = useStyles();

  return (
    <Box>
      <AppBar className={classes.appbar} position="static">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="body1">
            タイム: <strong>{formatTime(timeTyping)}</strong>
            <br />
            ミスタイプ: <strong>{missCount}回</strong>
          </Typography>
          <div className={classes.codeLanguageContainer}>
            {codeLanguageIcons[codeLanguage]}
            <Typography variant="h6" sx={{ marginLeft: "10px" }}>
              {codeLanguage}
            </Typography>
          </div>
          <Button variant="contained" color="inherit" sx={{ color: "black" }} onClick={reset}>
            reset
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default GameHeader;
