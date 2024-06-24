import "../index.css";
import NavBar from "../Navbar";
import { SessionProvider } from "../StateProvider";
import "@mantine/core/styles.css";
import { ColorSchemeScript, MantineProvider, createTheme } from "@mantine/core";

export const metadata = {
  title: "Focus",
  description: "Pomodoro app",
};

const theme = createTheme({
  fontSizes: {
    xs: "1rem",
    sm: "1.5rem",
    md: "2rem",
    lg: "2.5rem",
    xl: "3rem",
  },
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <html lang="en">
        <head>
          <meta name="theme-color" content="#000000" />
          <meta name="description" content="Pomodoro app" />
          <ColorSchemeScript />
          <title>Focus</title>
        </head>
        <body>
          <NavBar />
          <MantineProvider theme={theme} defaultColorScheme="dark">
            {children}
          </MantineProvider>
        </body>
      </html>
    </SessionProvider>
  );
}
