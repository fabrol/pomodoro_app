"use client";

import React, { useContext } from "react";
import PomodoroStatsDisplay from "../../PomodoroStatsDisplay";
import { SessionContext } from "../../StateProvider"; // Import SessionContext

export default function StatsPage() {
  const { history } = useContext(SessionContext); // Use context to get the history

  return <PomodoroStatsDisplay history={history} />;
}
