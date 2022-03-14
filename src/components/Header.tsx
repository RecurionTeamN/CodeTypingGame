import React from "react";
import { AppBar, Typography, Box, Toolbar, Button, Theme } from "@mui/material";
import { Link } from "react-router-dom";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme: Theme) => ({
  appbar: {
    backgroundColor: theme.palette.primary.main,
    marginBottom: "20px",
    padding: "5px",
  },
}));

const Header = () => {
  const classes = useStyles();

  return (
    <Box>
      <AppBar className={classes.appbar} position="static">
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box>
            <Typography component={Link} to="/" variant="h3" sx={{ color: "inherit", textDecoration: "none" }}>
              TypeCode
            </Typography>
          </Box>
          <Button variant="contained">settings</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Header;
