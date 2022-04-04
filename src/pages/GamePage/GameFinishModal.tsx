import React from "react";
import { Link } from "react-router-dom";
import { Backdrop, Button, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import DoughnutChartResult from "../../components/DoughnutChartResult";
import theme from "../../styles/Theme";
import TwitterShare from "../../components/TwitterShare";

type Result = {
  speed: number;
  accuracy: number;
  codeTitle: string;
  textLength: number;
};

type Props = {
  result: Result;
  successModalOpen: boolean;
};

const dropIn = {
  hidden: {
    y: "-100vh",
    opacity: 0,
  },
  visible: {
    y: "0",
    opacity: 1,
    transition: {
      duration: 0.3,
      type: "spring",
      damping: 20,
      stiffness: 300,
    },
  },
  exit: {
    y: "100vh",
    opacity: 0,
  },
};

const useStyles = makeStyles(() => ({
  modal: {
    width: "clamp(35%, 500px, 90%)",
    height: "min(55%, 500px)",
    margin: "auto",
    padding: "20px 20px",
    borderRadius: "12px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: theme.palette.grey[50],
  },
}));

const GameFinishModal: React.VFC<Props> = ({ result, successModalOpen }) => {
  const classes = useStyles();

  return (
    <Backdrop open={successModalOpen}>
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className={classes.modal}
        variants={dropIn}
        initial="hidden"
        animate="visible"
      >
        <div style={{ display: "flex", marginTop: "3%" }}>
          <DoughnutChartResult type="accuracy" value={result.accuracy} />
          <DoughnutChartResult type="speed" value={result.speed} />
        </div>
        <Typography variant="h4" marginBottom="3%">
          <span>文字数: </span>
          <CountUp start={0} end={result.textLength} duration={1.5} delay={0.5} />
        </Typography>
        {result.codeTitle && (
          <Typography align="center" variant="h6" color={theme.palette.grey[600]}>
            今回のコード内容:
            <br />
            {result.codeTitle}
          </Typography>
        )}
        <TwitterShare result={result} />
        <div style={{ width: "100%", display: "flex", justifyContent: "space-evenly", marginTop: "20px" }}>
          <Button variant="outlined" sx={{ width: "40%" }} component={Link} to="/dashboard">
            戻る
          </Button>
          <Button variant="contained" color="info" sx={{ width: "40%" }} component={Link} to="/results">
            結果の詳細
          </Button>
        </div>
      </motion.div>
    </Backdrop>
  );
};

export default GameFinishModal;
