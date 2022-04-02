import React from "react";
import { Link } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import { Button, Card, CardContent, Theme, Typography } from "@mui/material";

const useStyles = makeStyles((theme: Theme) => ({
  card: {
    padding: "20px 20px",
    borderRadius: "30px",
    backgroundColor: theme.palette.grey[800],
  },
  cardContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
}));

type Props = {
  displayName: string | null | undefined;
};

const GameStartCard: React.VFC<Props> = ({ displayName }) => {
  const classes = useStyles();

  return (
    <Card className={classes.card} variant="outlined">
      <CardContent className={classes.cardContent}>
        <Typography variant="h4" color="white">
          <strong>
            Welcome!
            <br />
            {displayName}
          </strong>
        </Typography>
        <Button
          component={Link}
          to="/game"
          color="primary"
          variant="contained"
          style={{ width: "30%", height: "45px" }}
        >
          START GAME!
        </Button>
      </CardContent>
    </Card>
  );
};

export default GameStartCard;
