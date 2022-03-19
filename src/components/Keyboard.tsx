import React from "react";
import SimpleKeyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";

type Props = {
  layoutName: string;
};

const layout = {
  english: {
    default: [
      "` 1 2 3 4 5 6 7 8 9 0 - = {backspace}",
      "{tab} q w e r t y u i o p [ ] \\",
      "{capslock} a s d f g h j k l ; ' {enter}",
      "{shiftleft} z x c v b n m , . / {shiftright}",
      "{space}",
    ],
    shift: [
      "~ ! @ # $ % ^ & * ( ) _ + {backspace}",
      "{tab} Q W E R T Y U I O P { } |",
      '{capslock} A S D F G H J K L : " {enter}',
      "{shiftleft} Z X C V B N M < > ? {shiftright}",
      "{space}",
    ],
  },
  japanese: {
    default: [
      "` 1 2 3 4 5 6 7 8 9 0 - = {backspace}",
      "{tab} q w e r t y u i o p [ ] \\",
      "{capslock} a s d f g h j k l ; ' {enter}",
      "{shiftleft} z x c v b n m , . / {shiftright}",
      "{space}",
    ],
    shift: [
      "~ ! @ # $ % ^ & * ( ) _ + {backspace}",
      "{tab} Q W E R T Y U I O P { } |",
      '{capslock} A S D F G H J K L : " {enter}',
      "{shiftleft} Z X C V B N M < > ? {shiftright}",
      "{space}",
    ],
  },
};

const display = {
  "{escape}": "esc ⎋",
  "{tab}": "tab ⇥",
  "{backspace}": "backspace ⌫",
  "{enter}": "enter ↵",
  "{capslock}": "caps lock ⇪",
  "{shiftleft}": "shift ⇧",
  "{shiftright}": "shift ⇧",
};

const Keyboard: React.VFC<Props> = ({ layoutName }) => (
  <SimpleKeyboard
    layout={layout.english}
    display={display}
    layoutName={layoutName}
    physicalKeyboardHighlight
    mergeDisplay
  />
);

export default Keyboard;
