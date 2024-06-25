"use client";

import "../index.css";
import NavBar from "../Navbar";
import { SessionProvider } from "../SessionProvider";
import "@mantine/core/styles.css";
import { ColorSchemeScript, MantineProvider, createTheme } from "@mantine/core";

const theme = createTheme({
  fontSizes: {
    xs: "1rem",
    smm: "1.2rem",
    sm: "1.5rem",
    md: "2rem",
    lg: "2.5rem",
    xl: "3rem",
  },
  colors: {
    myGreen: [
      "jE7FDF0",
      "#BDFAD4",
      "#93F6B8",
      "#68F39D",
      "#3EEF81",
      "#13EC65",
      "#0FBD51",
      "#0C8D3D",
      "#085E29",
      "#042F14",
    ],
  },
  primaryColor: "myGreen",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#000000" />
        <meta name="description" content="Pomodoro app" />
        <ColorSchemeScript />
        <title>Focus</title>
      </head>
      <body>
        <MantineProvider theme={theme} defaultColorScheme="dark">
          <NavBar />
          <SessionProvider>{children}</SessionProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
