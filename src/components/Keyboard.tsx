import React from "react";
import { keyboardData } from "../data/keyboardData";

type KeyboardType = keyof typeof keyboardData;

type Props = {
  keyboardType: KeyboardType;
  color?: {
    [keyName: string]: string;
  };
  onClick?: (keyName: string) => void;
};

const Keyboard: React.VFC<Props> = ({ keyboardType, color = {}, onClick = () => null }) => {
  const keyData = keyboardData[keyboardType];
  const defaultKeyArr = Object.keys(keyData).filter((keyName) => keyData[keyName].keyType === "default");
  // keyboardのposition(行番号、列番号)でソート。
  defaultKeyArr.sort(
    (keyA, keyB) =>
      keyData[keyA].position[0] * 100 +
      keyData[keyA].position[1] -
      (keyData[keyB].position[0] * 100 + keyData[keyB].position[1])
  );
  let pathXPosition = 0;
  let pathYPosition = 0;
  const paths = defaultKeyArr.map((keyName) => {
    const size = keyData[keyName].size ?? "S";
    let width = 0;
    switch (size) {
      case "S":
        width = 9;
        break;
      case "M":
        width = 11;
        break;
      case "L":
        width = 13;
        break;
      case "XL":
        width = 16;
        break;
      case "XXL":
        width = 17;
        break;
      case "XXXL":
        width = 21;
        break;
      case "jis-space":
        width = 25;
        break;
      case "us-space":
        width = 59;
        break;
      case "mac-jis-space":
        width = 35;
        break;
      case "mac-us-space":
        width = 49;
        break;
      case "hexaEnter":
        width = 13;
        break;
      default:
    }
    const height = 9;

    let keyText = keyName;
    if (keyText === "caps lock") keyText = "caps";
    else if (keyText === "Backspace") keyText = "←";
    else if (keyText.includes("r-") || keyText.includes("l-")) keyText = keyText.slice(2);

    pathYPosition = 10 * keyData[keyName].position[0];
    if (keyData[keyName].position[1] === 0) pathXPosition = 0;
    const path = (
      <g key={keyName}>
        {size !== "hexaEnter" ? (
          <rect
            fill={color[keyName] ?? "none"}
            stroke="black"
            strokeWidth="0.1"
            x={pathXPosition}
            y={pathYPosition}
            rx="1"
            ry="1"
            width={width}
            height={height}
            id={keyName}
            onClick={() => onClick(keyName)}
          />
        ) : (
          <path
            fill={color[keyName] ?? "none"}
            stroke="black"
            strokeWidth="0.1"
            d={`
            M ${pathXPosition} ${pathYPosition + 1}
            a 1 1 90 0 1 1 -1
            l ${width - 2} 0 
            a 1 1 90 0 1 1 1
            l 0 17
            a 1 1 90 0 1 -1 1
            l -${width - 4} 0
            a 1 1 90 0 1 -1 -1
            l 0 -8
            a 1 1 90 0 0 -1 -1
            a 1 1 90 0 1 -1 -1
            z
          `}
            id={keyName}
            onClick={() => onClick(keyName)}
          />
        )}
        <text
          x={pathXPosition + 1}
          y={pathYPosition + 6}
          fontFamily="sans-serif"
          fontSize={keyText.length === 1 ? "4" : "2"}
        >
          {keyText}
        </text>
      </g>
    );
    pathXPosition += width + 1;
    return path;
  });

  return (
    <svg viewBox="0 0 150 50" version="1.1" id="svg5" xmlns="http://www.w3.org/2000/svg">
      <defs id="defs1" />
      {paths}
    </svg>
  );
};

export default Keyboard;
