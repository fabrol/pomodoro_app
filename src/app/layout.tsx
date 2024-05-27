import "../index.css";
import type { Metadata } from "next";

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
        <title>Focus</title>
      </head>
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  );
}
