import React from "react";
import { Box, Grid, Theme } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { motion } from "framer-motion";
import Header from "../../components/Header";
import useGameHistoryCollection from "../../hooks/useGameHistoryCollection";
import useAuthContext from "../../hooks/useAuthContext";
import CalendarHeatmap from "./CalendarHeatmap";
import ResultTable from "./ResultTable";
import LineChart from "./LineChart";
import GameStartCard from "./GameStartCard";
import Loader from "../../components/Loader";

const useStyles = makeStyles((theme: Theme) => ({
  main: {
    height: "100vh",
  },
  contentContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
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
  gameStartContainer: {
    width: "60%",
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
        {isPending && (
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
        )}
        {!isPending && gameHistoryDocuments && (
          <>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className={classes.gameStartContainer}
              >
                <GameStartCard displayName={authState.user?.displayName} playCount={gameHistoryDocuments.length} />
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
            >
              <div className={classes.calendarContainer}>
                {/* カレンダーヒートマップ */}
                {gameHistoryDocuments && (
                  <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                    {[2, 1, 0].map((shift) => (
                      <CalendarHeatmap
                        key={shift}
                        gameHistoryDocuments={gameHistoryDocuments}
                        currentYear={
                          new Date().getMonth() - shift >= 0 ? new Date().getFullYear() : new Date().getFullYear() - 1
                        }
                        currentMonth={
                          new Date().getMonth() - shift >= 0
                            ? new Date().getMonth() - shift
                            : 12 + (new Date().getMonth() - shift)
                        }
                        width={250}
                      />
                    ))}
                  </Box>
                )}
              </div>
              {/* Card Grid */}
              <Grid container spacing={2} paddingX="8%" paddingY="10px">
                <Grid item xs={12} md={12} xl={6}>
                  <LineChart gameHistory={gameHistoryDocuments} />
                </Grid>
                <Grid item xs={12} md={12} xl={6}>
                  <ResultTable tableHeight={300} />
                </Grid>
              </Grid>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
