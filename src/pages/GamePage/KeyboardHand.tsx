import React, { useState } from "react";
import { makeStyles } from "@mui/styles";
import Keyboard from "../../components/Keyboard";
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
    width: "100%",
    position: "absolute",
    top: "70px",
    left: "0",
    opacity: "0.6",
  },
}));

type Props = {
  leftFin: "first" | "thumb" | "second" | "third" | "fourth" | null;
  rightFin: "first" | "thumb" | "second" | "third" | "fourth" | null;
};

const KeyboardHand: React.FC<Props> = ({ leftFin, rightFin }) => {
  const classes = useStyles();
  const [layoutName, setLayoutName] = useState("default");

  const leftHandColor = leftFin ? { [leftFin]: "#0000FF" } : undefined;
  const rightHandColor = rightFin ? { [rightFin]: "#0000FF" } : undefined;

  document.onkeydown = (e) => {
    if (e.key.toLowerCase() === "shift") {
      setLayoutName("shift");
    }
  };

  document.onkeyup = (e) => {
    if (e.key.toLowerCase() === "shift") {
      setLayoutName("default");
    }
  };

  return (
    <div className={classes.keyboardContainer}>
      <Keyboard layoutName={layoutName} />
      <div className={classes.handsContainer}>
        <HandSVG hand="left" color={leftHandColor} />
        <HandSVG hand="right" color={rightHandColor} />
      </div>
    </div>
  );
};

export default KeyboardHand;
