import React from "react";
import { makeStyles } from "@mui/styles";
import { Typography, Theme } from "@mui/material";
import GoogleButton from "react-google-button";
import Header from "../../components/Header";
import useLogin from "../../hooks/useLogin";
import landingPageSVG from "../../assets/images/landingpage.svg";

const useStyles = makeStyles((theme: Theme) => ({
  mainSection: {
    height: "80vh",
    display: "flex",
    justifyContent: "space-evenly",
    alignItems: "center",
    padding: "20px 200px",
  },
  content: {
    position: "relative",
    maxWidth: "600px",
  },
  spanText: {
    color: theme.palette.primary.main,
  },
}));

const LandingPage = () => {
  const classes = useStyles();
  const { googleLogin } = useLogin();

  return (
    <div>
      <Header />
      <div className={classes.mainSection}>
        <div className={classes.content}>
          <Typography gutterBottom variant="h2" component="div">
            Practice
            <br />
            Typing for <span className={classes.spanText}>Programmers</span>
          </Typography>
          <GoogleButton
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onClick={googleLogin}
          />
        </div>
        <div>
          <img src={landingPageSVG} alt="landing-page-svg" />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
