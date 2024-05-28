import "./App.css";
import React, { useState, useCallback, useEffect } from "react";
import Timer from "./Timer"; // Import the Timer component
import PomodoroCircles from "./PomodoroCircles"; // Import the PomodoroCircles component
import PomodoroHistory, { Time } from "./PomodoroHistory";
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
  const [history] = useState(new PomodoroHistory());
  const [currentTime, setCurrentTime] = useState<Time>({
    minutes: 0,
    seconds: 0,
  });

  const isTestMode = true; // Set this to false in production

  useEffect(() => {
    fetchPomodoroHistory();
  }, [session]);

  const fetchPomodoroHistory = async () => {
    try {
      let user_id = session?.user.id;
      if (!user_id) {
        console.log("No user found");
        return;
      }

      console.log("Looking for user:", user_id);
      let { data, error } = await supabase
        .from("pomo_history")
        .select("*")
        .eq("user_id", user_id);

      if (error) {
        throw error;
      }

      console.log(data);
      return data;
    } catch (error) {
      console.error("Error fetching Pomodoro history:", error);
      return null;
    }
  };

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

  const advancePomodoro = useCallback(() => {
    const newPomodoroIndex = (currentPomodoro + 1) % pomodoroIntervals.length;
    setCurrentPomodoro(newPomodoroIndex);
    history.addEntry(
      currentPomodoro,
      currentTime.minutes === 0 && currentTime.seconds === 0,
      currentTime
    );
  }, [currentPomodoro, history, currentTime]);

  const resetPomodoro = useCallback(() => {
    setCurrentPomodoro(0);
    history.addEntry(currentPomodoro, false, currentTime);
  }, [currentPomodoro, history, currentTime]);

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
