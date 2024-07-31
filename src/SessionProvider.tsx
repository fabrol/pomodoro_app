"use client";

import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useMemo,
} from "react";
import { Session, SupabaseClient } from "@supabase/supabase-js";
import { PomodoroEntry } from "./PomodoroHistory";
import { createClient } from "@supabase/supabase-js";
import PomodoroHistory from "./PomodoroHistory";
import { AuthenticationForm } from "./Login";
import { pomodoroIntervals, Time } from "./constants";

const supabaseUrl = "https://iyrfwbftinurdoauzggs.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5cmZ3YmZ0aW51cmRvYXV6Z2dzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTY0MTE3NzYsImV4cCI6MjAzMTk4Nzc3Nn0.xPzv4ZRhsHYsWznLEK-g8bIeJJvcrA0-aYBZl0Obw-s";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const SessionContext = createContext<{
  session: Session | null;
  history: PomodoroEntry[];
  setHistory: (history: PomodoroEntry[]) => void;
  historyManager: PomodoroHistory;
  currentPomodoro: number;
  setCurrentPomodoro: React.Dispatch<React.SetStateAction<number>>;
  currentTime: Time;
  setCurrentTime: React.Dispatch<React.SetStateAction<Time>>;
  isActive: boolean;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
  animationKey: number;
  setAnimationKey: React.Dispatch<React.SetStateAction<number>>;
}>({
  session: null,
  history: [],
  setHistory: () => {},
  historyManager: new PomodoroHistory({
    supabase,
    history: [],
    setHistory: () => {},
  }), // Default initialization
  currentPomodoro: 0,
  setCurrentPomodoro: () => {},
  currentTime: pomodoroIntervals[0],
  setCurrentTime: () => {},
  isActive: false,
  setIsActive: () => {},
  animationKey: 0,
  setAnimationKey: () => {},
});

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [session, setSession] = useState<Session | null>(null);
  const [history, setHistory] = useState<PomodoroEntry[]>([]);
  const historyManager = useMemo(
    () => new PomodoroHistory({ supabase, history, setHistory }),
    [history]
  );

  const [currentPomodoro, setCurrentPomodoro] = useState(0);
  const [currentTime, setCurrentTime] = useState<Time>(
    pomodoroIntervals[currentPomodoro]
  );
  const [isActive, setIsActive] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    const signInAnonymously = async () => {
      if (session) {
        return;
      }

      console.log("Getting session in anon func");
      const {
        data: { session: sess },
      } = await supabase.auth.getSession();

      if (sess) {
        console.log("Got session in anon func");
        setSession(sess);
      } else {
        console.log("Signing in anonymously");
        const { data, error } = await supabase.auth.signInAnonymously();
        if (error) {
          console.error("Error signing in anonymously:", error);
        }
      }
    };
    signInAnonymously();
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fetch the pomodoro history when the session changes
  useEffect(() => {
    historyManager.fetchPomodoroHistory("From session useEffect");
  }, [session]);

  // Add logging
  useEffect(() => {
    console.log("SessionProvider state updated:", {
      currentPomodoro,
      currentTime,
      isActive,
      animationKey,
    });
  }, [currentPomodoro, currentTime, isActive, animationKey]);

  const contextValue = useMemo(
    () => ({
      session,
      history,
      setHistory,
      historyManager,
      currentPomodoro,
      setCurrentPomodoro,
      currentTime,
      setCurrentTime,
      isActive,
      setIsActive,
      animationKey,
      setAnimationKey,
    }),
    [session, history, currentPomodoro, currentTime, isActive, animationKey]
  );

  return (
    <SessionContext.Provider value={contextValue}>
      {session && children}
    </SessionContext.Provider>
  );
};
