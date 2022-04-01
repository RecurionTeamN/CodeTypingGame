import React from "react";
import { makeStyles } from "@mui/styles";
import { Typography, Theme } from "@mui/material";
import GoogleButton from "react-google-button";
import useLogin from "../../hooks/useLogin";
import landingPageSVG from "../../assets/images/landingpage.svg";
import LandingTypingLetters from "./TypingLetters";

const useStyles = makeStyles((theme: Theme) => ({
  mainContainer: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  mainSection: {
    height: "70vh",
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
  content: {
    position: "relative",
    paddingLeft: "20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    maxWidth: "600px",
    height: "350px",
  },
  spanText: {
    color: theme.palette.primary.main,
  },
  img: {
    maxWidth: "550px",
  },
}));

const LandingPage = () => {
  const classes = useStyles();
  const { googleLogin } = useLogin();

  return (
    // <Header />
    <div className={classes.mainContainer}>
      <div className={classes.mainSection}>
        <div className={classes.content}>
          <Typography gutterBottom variant="h2" component="div">
            {/* Typing for <span className={classes.spanText}>Programmers</span> */}
            <LandingTypingLetters />
          </Typography>
          <div>
            <GoogleButton
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              onClick={googleLogin}
            />
          </div>
        </div>
        <div>
          <img className={classes.img} src={landingPageSVG} alt="landing-page-svg" />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
