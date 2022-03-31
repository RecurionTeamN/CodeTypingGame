import React from "react";
import { Link } from "react-router-dom";
import { Box } from "@mui/material";
import Header from "../../components/Header";
import useGameHistoryCollection from "../../hooks/useGameHistoryCollection";
import useAuthContext from "../../hooks/useAuthContext";
import useProfileContext from "../../hooks/useProfileContext";
import CalendarHeatmap from "./CalendarHeatmap";

const DashboardPage = () => {
  const { documents: gameHistoryDocuments, isPending } = useGameHistoryCollection();
  const { authState } = useAuthContext();
  const { profileState } = useProfileContext();

  return (
    <div>
      <Header />
      <h1>DashboardPage</h1>
      <div>
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
      </div>
      <div>
        <h1>GameHistory data for {authState.user?.displayName}</h1>
        {isPending ? (
          <div>loading...</div>
        ) : (
          <>
            <ul>
              {gameHistoryDocuments && gameHistoryDocuments.length ? (
                gameHistoryDocuments.map((game) => (
                  <li key={game.id}>
                    <p>language: {game.codeLang}</p>
                    <p>accuracy: {game.accuracy}</p>
                    <p>speed: {game.speed}</p>
                    <p>uid: {game.uid}</p>
                    <p>createdAt: {game.createdAt.toDate().toDateString()}</p>
                  </li>
                ))
              ) : (
                <p>This user has no game history</p>
              )}
            </ul>

            {/* カレンダーヒートマップ */}
            {gameHistoryDocuments && (
              <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                {[2, 1, 0].map((shift) => (
                  <CalendarHeatmap
                    gameHistoryDocuments={gameHistoryDocuments}
                    currentYear={new Date().getFullYear() - shift}
                    currentMonth={new Date().getMonth() - shift}
                    width={250}
                  />
                ))}
              </Box>
            )}
          </>
        )}
      </div>
      <div>
        <h1>Best Scores for {authState.user?.displayName}</h1>
        <ul>
          {Object.entries(profileState.bestScores).map(([codeLang, value]) => (
            <li key={codeLang}>
              <h2>{codeLang}</h2>
              <p>accuracy: {value.accuracy}</p>
              <p>speed: {value.speed}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DashboardPage;
