import React from "react";
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
import { CodeLangTypes } from "../context/profile/types";

type CodeLanguageIconsType = {
  [keyName in CodeLangTypes]: JSX.Element;
};

type Props = {
  codeLanguage: CodeLangTypes;
  size: number;
};

const CodeLanguageIcon: React.VFC<Props> = ({ codeLanguage, size }) => {
  const codeLanguageIcons: CodeLanguageIconsType = {
    Typescript: <SiTypescript size={size} />,
    Javascript: <SiJavascript size={size} />,
    Python: <SiPython size={size} />,
    Go: <SiGo size={size} />,
    Java: <SiJava size={size} />,
    Kotlin: <SiKotlin size={size} />,
    Php: <SiPhp size={size} />,
    "C#": <SiCsharp size={size} />,
    "C++": <SiCplusplus size={size} />,
    Swift: <SiSwift size={size} />,
    Ruby: <SiRuby size={size} />,
    R: <SiR size={size} />,
  };
  return codeLanguageIcons[codeLanguage];
};

export default CodeLanguageIcon;
