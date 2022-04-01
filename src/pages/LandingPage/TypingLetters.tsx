import React from "react";
import Typerwriter from "typewriter-effect";
import theme from "../../styles/Theme";

const LandingTypingLetters = () => (
  <Typerwriter
    options={{
      autoStart: true,
      loop: true,
    }}
    onInit={(typewriter) => {
      typewriter
        .pauseFor(500)
        .typeString("<strong>Practice</strong><br />")
        .typeString("<strong>Typing For</strong><br />")
        .typeString(`<strong><span style="color: ${theme.palette.success.light};">Programmers.</span></strong>`)
        .pauseFor(5000)
        .start();
    }}
  />
);

export default LandingTypingLetters;
