import React from "react";
import { Box, Grid, Theme } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { motion } from "framer-motion";
import Header from "../../components/Header";
import useGameHistoryCollection from "../../hooks/useGameHistoryCollection";
import useAuthContext from "../../hooks/useAuthContext";
import CalendarHeatmap from "./CalendarHeatmap";
import LineChart from "./LineChart";
import GameStartCard from "./GameStartCard";
import Loader from "../../components/Loader";

const useStyles = makeStyles((theme: Theme) => ({
  main: {
    height: "100vh",
    overflow: "hidden",
  },
  contentContainer: {
    height: "80vh",
  },
  calendarContainer: {
    display: "flex",
    justifyContent: "center",
    paddingTop: "2%",
  },
  loaderContainer: {
    display: "flex",
    height: "70vh",
    justifyContent: "center",
    alignItems: "center",
  },
}));

const DashboardPage = () => {
  const classes = useStyles();
  const { documents: gameHistoryDocuments, isPending } = useGameHistoryCollection();
  const { authState } = useAuthContext();

  return (
    <div className={classes.main}>
      <Header />
      <div className={classes.contentContainer}>
        {isPending ? (
          <motion.div
            key="child"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className={classes.loaderContainer}
          >
            <Loader />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className={classes.calendarContainer}>
              {/* カレンダーヒートマップ */}
              {gameHistoryDocuments && (
                <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                  {[2, 1, 0].map((shift) => (
                    <CalendarHeatmap
                      gameHistoryDocuments={gameHistoryDocuments}
                      currentYear={new Date().getFullYear()}
                      currentMonth={new Date().getMonth() - shift}
                      width={250}
                    />
                  ))}
                </Box>
              )}
            </div>
            {/* Card Grid */}
            <Grid container spacing={2} paddingX="6%" marginTop="2%">
              <Grid item xs={12} md={12} xl={6}>
                <GameStartCard displayName={authState.user?.displayName} />
              </Grid>
              <Grid item xs={12} md={12} xl={6}>
                <LineChart gameHistory={gameHistoryDocuments} />
              </Grid>
            </Grid>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
