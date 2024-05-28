import "./App.css";
import React, { useState, useCallback, useEffect } from "react";
import Timer from "./Timer"; // Import the Timer component
import PomodoroCircles from "./PomodoroCircles"; // Import the PomodoroCircles component
import PomodoroHistory, { PomodoroEntry, Time } from "./PomodoroHistory";
import PomodoroHistoryDisplay from "./PomodoroHistoryDisplay";
import { Session, createClient } from "@supabase/supabase-js";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Database } from "./types/database.types";

const pomodoroIntervals = [
  { minutes: 25, seconds: 0, type: "work" },
  { minutes: 5, seconds: 0, type: "shortBreak" },
  { minutes: 25, seconds: 0, type: "work" },
  { minutes: 5, seconds: 0, type: "shortBreak" },
  { minutes: 25, seconds: 0, type: "work" },
  { minutes: 5, seconds: 0, type: "shortBreak" },
  { minutes: 25, seconds: 0, type: "work" },
  { minutes: 30, seconds: 0, type: "longBreak" },
];

const supabase = createClient<Database>(
  "https://iyrfwbftinurdoauzggs.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5cmZ3YmZ0aW51cmRvYXV6Z2dzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTY0MTE3NzYsImV4cCI6MjAzMTk4Nzc3Nn0.xPzv4ZRhsHYsWznLEK-g8bIeJJvcrA0-aYBZl0Obw-s"
);

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [currentPomodoro, setCurrentPomodoro] = useState(0);
  const [history, setHistory] = useState<PomodoroEntry[]>([]);
  const historyManager = new PomodoroHistory({ supabase, history, setHistory });

  const [currentTime, setCurrentTime] = useState<Time>({
    minutes: 0,
    seconds: 0,
  });

  const isTestMode = true; // Set this to false in production

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session as any);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session as any);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch the pomodoro history when the session changes
  useEffect(() => {
    historyManager.fetchPomodoroHistory("From session useEffect");
  }, [session]);

  const advancePomodoro = useCallback(() => {
    const newPomodoroIndex = (currentPomodoro + 1) % pomodoroIntervals.length;
    setCurrentPomodoro(newPomodoroIndex);
    historyManager.addEntry(
      currentPomodoro,
      currentTime.minutes === 0 && currentTime.seconds === 0,
      currentTime
    );
  }, [currentPomodoro, currentTime]);

  const resetPomodoro = useCallback(() => {
    setCurrentPomodoro(0);
    historyManager.addEntry(currentPomodoro, false, currentTime);
  }, [currentPomodoro, historyManager, currentTime]);

  if (!session) {
    return <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />;
  } else {
    return (
      <div className="App">
        <header className="App-header">
          <Timer
            key={currentPomodoro} // Change key to reset Timer
            advanceFunc={advancePomodoro}
            initialMinutes={
              isTestMode ? 0 : pomodoroIntervals[currentPomodoro].minutes
            }
            initialSeconds={
              isTestMode ? 5 : pomodoroIntervals[currentPomodoro].seconds
            }
            type={pomodoroIntervals[currentPomodoro].type}
            setCurrentTime={setCurrentTime}
            currentTime={currentTime}
          />{" "}
          {/* Use the Timer component */}
          <div>
            <PomodoroCircles
              currentPomodoro={Math.floor(currentPomodoro / 2)}
            />
            <button onClick={advancePomodoro}>Next Pomodoro</button>
            <button onClick={resetPomodoro}>Reset Pomodoro</button>
          </div>
          <PomodoroHistoryDisplay history={history} />
        </header>
      </div>
    );
  }
}

export default App;
