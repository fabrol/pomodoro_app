import "../index.css";
import NavBar from "../Navbar";
import { SessionProvider } from "../StateProvider";

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
          <title>Focus</title>
        </head>
        <body>
          <div id="root">
            <NavBar />
            {children}
          </div>
        </body>
      </html>
    </SessionProvider>
  );
}
