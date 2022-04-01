import React from "react";
import { makeStyles } from "@mui/styles";
import Keyboard from "../../components/NewKeyboard";
import HandSVG from "../../components/HandSVG";

const useStyles = makeStyles(() => ({
  keyboardContainer: {
    marginTop: "20px",
    position: "relative",
    width: "60%",
  },
  handsContainer: {
    display: "flex",
    justifyContent: "center",
    width: "80%",
    position: "absolute",
    top: "10vh",
    left: "0",
    opacity: "0.6",
  },
}));

type Props = {
  leftFin: "first" | "thumb" | "second" | "third" | "fourth" | null;
  rightFin: "first" | "thumb" | "second" | "third" | "fourth" | null;
  keyboardType: "jis" | "us" | "mac-jis" | "mac-us";
  nextKeys?: string[];
};

type KeyColor = {
  [keyName: string]: string;
};

const KeyboardHand: React.VFC<Props> = ({ leftFin, rightFin, keyboardType, nextKeys = [] }) => {
  const classes = useStyles();

  const leftHandColor = leftFin ? { [leftFin]: "#0000FF" } : undefined;
  const rightHandColor = rightFin ? { [rightFin]: "#0000FF" } : undefined;
  const keyColor: KeyColor = {};
  nextKeys.forEach((keyName) => {
    keyColor[keyName] = "#66FFCC";
  });

  return (
    <div className={classes.keyboardContainer}>
      <Keyboard keyboardType={keyboardType} color={keyColor} />
      <div className={classes.handsContainer}>
        <HandSVG hand="left" color={leftHandColor} />
        <HandSVG hand="right" color={rightHandColor} />
      </div>
    </div>
  );
};

export default KeyboardHand;
