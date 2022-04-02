import React from "react";
import { MutatingDots } from "react-loader-spinner";
import theme from "../styles/Theme";

const Loader = () => <MutatingDots height="100" width="100" color={theme.palette.primary.main} ariaLabel="loading" />;

export default Loader;
