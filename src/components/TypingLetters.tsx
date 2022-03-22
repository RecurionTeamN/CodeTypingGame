import React from "react";
import Typerwriter from "typewriter-effect";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles(() => ({
  typingAnimation: {
    fontSize: "50px",
    fontFamily: "Courier New",
  },
}));

const TypingLetters: React.VFC<{ initLetters: string; secondLetters: string }> = ({ initLetters, secondLetters }) => {
  const classes = useStyles();
  return (
    <div className={classes.typingAnimation}>
      <Typerwriter
        onInit={(typewriter) => {
          typewriter.typeString(initLetters).pauseFor(Infinity).deleteAll().typeString(secondLetters).start();
        }}
      />
    </div>
  );
};

export default TypingLetters;
