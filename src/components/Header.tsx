import React from "react";
import { AppBar, Typography, Box, Toolbar, Theme, Tooltip, IconButton } from "@mui/material";
import { Link } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import { MdSettings } from "react-icons/md";
import useAuthContext from "../hooks/useAuthContext";
import AccountMenu from "./AccountMenu";

const useStyles = makeStyles((theme: Theme) => ({
  appbar: {
    backgroundColor: theme.palette.primary.main,
    marginBottom: "20px",
    padding: "5px",
  },
  headerContainer: {
    display: "flex",
    width: "100%",
    justifyContent: "center",
  },
  headerContent: {
    width: "70%",
  },
}));

const Header = () => {
  const classes = useStyles();
  const { authState } = useAuthContext();

  return (
    <Box>
      <AppBar className={classes.appbar} position="static">
        <div className={classes.headerContainer}>
          <div className={classes.headerContent}>
            <Toolbar sx={{ justifyContent: "space-between" }}>
              <Box>
                <Typography
                  component={Link}
                  to="/dashboard"
                  variant="h3"
                  sx={{ color: "inherit", textDecoration: "none" }}
                >
                  TypeCode
                </Typography>
              </Box>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Tooltip title="Game Settings">
                  <IconButton sx={{ display: "flex", flexDirection: "column" }} component={Link} to="/settings">
                    <MdSettings size={34} />
                    <span style={{ fontSize: "0.7rem", color: "white" }}>ゲーム設定</span>
                  </IconButton>
                </Tooltip>
                {authState.user && <AccountMenu />}
              </div>
            </Toolbar>
          </div>
        </div>
      </AppBar>
    </Box>
  );
};

export default Header;
