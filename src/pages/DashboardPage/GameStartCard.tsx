import React from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import { Button, Card, CardContent, Typography } from "@mui/material";
import CountUp from "react-countup";
import theme from "../../styles/Theme";

const useStyles = makeStyles(() => ({
  card: {
    padding: "0 10px",
    borderRadius: "25px",
    backgroundColor: theme.palette.grey[800],
  },
  cardContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  startButton: {
    backgroundColor: theme.palette.success.light,
    color: theme.palette.success.contrastText,
    height: "80px",
    width: "140px",
    borderRadius: "25px",
    transition: "transform 0.25s ease-in-out",
    "&:hover": {
      backgroundColor: theme.palette.success.light,
      transform: "scale3d(1.05, 1.05, 1)",
    },
  },
}));

type Props = {
  displayName: string | null | undefined;
  playCount: number;
};

const GameStartCard: React.VFC<Props> = ({ displayName, playCount }) => {
  const classes = useStyles();

  return (
    <Card className={classes.card} variant="outlined">
      <CardContent className={classes.cardContent}>
        <div>
          <Typography fontSize="2rem" color="white">
            <strong>Welcome,</strong> {displayName}👋
          </Typography>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Typography fontSize="1rem" color="white" style={{ width: "200px" }}>
              プレイ回数:{" "}
              <span style={{ fontSize: "1.5rem", color: theme.palette.primary.main }}>
                <strong>
                  <CountUp start={0} end={playCount} duration={2} delay={0.5} />
                </strong>
              </span>
            </Typography>
          </div>
        </div>
        <Button component={Link} to="/game" className={classes.startButton}>
          <Typography fontSize="1.5rem" color="white">
            <strong>start</strong>
          </Typography>
        </Button>
      </CardContent>
    </Card>
  );
};

export default GameStartCard;
