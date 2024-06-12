"use client";

import React, { createContext, useState, useEffect, useContext } from "react";
import { Session, SupabaseClient } from "@supabase/supabase-js";
import { PomodoroEntry } from "./PomodoroHistory";
import { createClient } from "@supabase/supabase-js";
import PomodoroHistory from "./PomodoroHistory";

const supabaseUrl = "https://iyrfwbftinurdoauzggs.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5cmZ3YmZ0aW51cmRvYXV6Z2dzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTY0MTE3NzYsImV4cCI6MjAzMTk4Nzc3Nn0.xPzv4ZRhsHYsWznLEK-g8bIeJJvcrA0-aYBZl0Obw-s";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const SessionContext = createContext<{
  session: Session | null;
  history: PomodoroEntry[];
  setHistory: (history: PomodoroEntry[]) => void;
  historyManager: PomodoroHistory;
}>({
  session: null,
  history: [],
  setHistory: () => {},
  historyManager: new PomodoroHistory({
    supabase,
    history: [],
    setHistory: () => {},
  }), // Default initialization
});

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [session, setSession] = useState<Session | null>(null);
  const [history, setHistory] = useState<PomodoroEntry[]>([]);
  const historyManager = new PomodoroHistory({ supabase, history, setHistory });

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

  return (
    <SessionContext.Provider
      value={{ session, history, setHistory, historyManager }}
    >
      {children}
    </SessionContext.Provider>
  );
};
