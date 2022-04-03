import React from "react";
import { Link } from "react-router-dom";
import { Box, Card, CardMedia, Grid } from "@mui/material";
import Header from "../../components/Header";
import useGameHistoryCollection from "../../hooks/useGameHistoryCollection";
import useAuthContext from "../../hooks/useAuthContext";
import useProfileContext from "../../hooks/useProfileContext";
import CalendarHeatmap from "./CalendarHeatmap";
import ResultTable from "./ResultTable";

const DashboardPage = () => {
  const { documents: gameHistoryDocuments, isPending } = useGameHistoryCollection();
  const { authState } = useAuthContext();
  const { profileState } = useProfileContext();

  return (
    <div>
      <Header />
      {/* <h1>DashboardPage</h1> */}
      {/* <div>
        <ul>
          <li>
            <Link to="/game">GamePage</Link>
          </li>
          <li>
            <Link to="/results">ResultPage</Link>
          </li>
          <li>
            <Link to="/settings">SettingsPage</Link>
          </li>
        </ul>
      </div> */}
      <div>
        {/* <h1>GameHistory data for {authState.user?.displayName}</h1> */}
        {isPending ? (
          <div>loading...</div>
        ) : (
          <>
            {/* カレンダーヒートマップ */}
            {gameHistoryDocuments && (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 7,
                }}
              >
                {[2, 1, 0].map((shift) => (
                  <CalendarHeatmap
                    key={shift}
                    gameHistoryDocuments={gameHistoryDocuments}
                    currentYear={
                      new Date().getMonth() - shift >= 0
                        ? new Date().getFullYear()
                        : new Date().getFullYear() - 1 + (new Date().getMonth() - shift) / 11 + 0
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
          </>
        )}
      </div>

      <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 7 }}>
        <ResultTable profileState={profileState} height={308} width={700} />
      </Box>
    </div>
  );
};

export default DashboardPage;
