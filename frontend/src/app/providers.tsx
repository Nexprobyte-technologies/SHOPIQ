"use client";

import type { ReactNode } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#287451", dark: "#1d5c40", light: "#e8f2eb" },
    secondary: { main: "#173d30" },
    background: { default: "#f9fbf8", paper: "#ffffff" },
    text: { primary: "#1d2924", secondary: "#68736d" },
  },
  typography: {
    fontFamily: "Arial, Helvetica, sans-serif",
    button: { textTransform: "none", fontWeight: 700 },
  },
  shape: { borderRadius: 14 },
});

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
