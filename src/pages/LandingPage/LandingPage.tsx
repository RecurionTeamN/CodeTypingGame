import React from "react";
import { makeStyles } from "@mui/styles";
import { Typography } from "@mui/material";
import GoogleButton from "react-google-button";
import { motion } from "framer-motion";
import useLogin from "../../hooks/useLogin";
import landingPageSVG from "../../assets/images/landingpage.svg";
import LandingTypingLetters from "./TypingLetters";
import theme from "../../styles/Theme";
import CodeLanguageIcon from "../../components/CodeLanguageIcon";
import { codeLangs } from "../../context/profile/types";

const useStyles = makeStyles(() => ({
  mainContainer: {
    height: "100vh",
    backgroundColor: theme.palette.grey[100],
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center",
    overflow: "hidden",
  },
  mainSection: {
    height: "85vh",
    width: "100%",
    boxSizing: "border-box",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: "5%",
    paddingRight: "5%",
    [theme.breakpoints.up("xl")]: {
      paddingLeft: "15%",
      paddingRight: "15%",
    },
  },
  subSection: {
    height: "15vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  content: {
    position: "relative",
    paddingLeft: "20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    minWidth: "300px",
    maxWidth: "600px",
    height: "350px",
  },
  spanText: {
    color: theme.palette.primary.main,
  },
  img: {
    width: "550px",
    [theme.breakpoints.up("xl")]: {
      width: "625px",
    },
  },
  codeLanguagesContainer: {
    display: "flex",
    justifyContent: "space-evenly",
  },
  codeIcon: {
    paddingLeft: "10px",
    paddingRight: "10px",
  },
}));

const LandingPage = () => {
  const classes = useStyles();
  const { googleLogin } = useLogin();

  return (
    // <Header />
    <div className={classes.mainContainer}>
      <div className={classes.mainSection}>
        <motion.div className={classes.content} animate={{ x: [-400, 0] }} transition={{ duration: 1 }}>
          <Typography gutterBottom variant="h2" component="div">
            {/* Typing for <span className={classes.spanText}>Programmers</span> */}
            <LandingTypingLetters />
          </Typography>
          <motion.div animate={{ x: [-500, 0] }} transition={{ delay: 0.5, duration: 0.5 }}>
            <GoogleButton
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              onClick={googleLogin}
              type="light"
            />
          </motion.div>
        </motion.div>
        <motion.div animate={{ scale: [0, 1] }} transition={{ delay: 0.7, duration: 0.3 }}>
          <img className={classes.img} src={landingPageSVG} alt="landing-page-svg" />
        </motion.div>
      </div>
      <motion.div className={classes.subSection} animate={{ y: [200, 0] }} transition={{ delay: 0.7, duration: 0.5 }}>
        <Typography gutterBottom variant="h5" component="div" color={theme.palette.grey[600]} align="center">
          Supported Code Languages
        </Typography>
        <div>
          {codeLangs.map((language) => (
            <span className={classes.codeIcon}>
              <CodeLanguageIcon codeLanguage={language} size={40} />
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default LandingPage;
