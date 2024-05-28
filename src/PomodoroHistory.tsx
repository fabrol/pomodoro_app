import { Session, SupabaseClient } from "@supabase/supabase-js";
import { Database } from "./types/database.types";

export type Time = {
  minutes: number;
  seconds: number;
};

type PomodoroEntry = {
  timestamp: Date;
  pomodoroIndex: number;
  completed: boolean;
  timeLeft: Time;
};

function parseJsonToPomodoroEntry(jsonData: any): PomodoroEntry {
  return {
    timestamp: new Date(jsonData.timestamp),
    pomodoroIndex: jsonData.pomodoroIndex,
    completed: jsonData.completed,
    timeLeft: {
      minutes: jsonData.timeLeft.minutes,
      seconds: jsonData.timeLeft.seconds,
    },
  };
}

interface PomodoroHistoryProps {
  supabase: SupabaseClient<Database>;
}

class PomodoroHistory {
  private entries: PomodoroEntry[];
  private history: PomodoroEntry[];
  private supabase: SupabaseClient<Database>;

  constructor({ supabase }: PomodoroHistoryProps) {
    this.entries = [];
    this.history = [];
    this.supabase = supabase;

    this.supabase
      .channel("pomo_history")
      .on(
        "postgres_changes",
        { event: "*", schema: "public" },
        this.fetchPomodoroHistory
      )
      .subscribe();
  }

  fetchPomodoroHistory = async (payload: any) => {
    console.log("Change received!", payload);
    try {
      const {
        data: { session },
      } = await this.supabase.auth.getSession();
      if (!session) {
        console.log("No session found");
        return;
      }
      let user_id = session.user.id;

      console.log("Looking for user:", user_id);
      let { data, error } = await this.supabase
        .from("pomo_history")
        .select("*")
        .eq("user_id", user_id);

      if (error) {
        throw error;
      }

      if (!data) {
        console.log("No data found");
        return;
      }

      if (Array.isArray(data[0].history)) {
        this.history = data[0].history.map(parseJsonToPomodoroEntry);
        console.log("Setting history to:", this.history);
      } else {
        console.error(
          "Expected history to be an array but received:",
          typeof data[0].history
        );
      }
      return data;
    } catch (error) {
      console.error("Error fetching Pomodoro history:", error);
      return null;
    }
  };

  addEntry(pomodoroIndex: number, completed: boolean, timeLeft: Time) {
    const entry: PomodoroEntry = {
      timestamp: new Date(),
      pomodoroIndex,
      completed,
      timeLeft,
    };
    console.log(
      `Timestamp=${entry.timestamp.toLocaleString()}, PomodoroIndex=${
        entry.pomodoroIndex
      }, Completed=${entry.completed}, TimeLeft=${entry.timeLeft.minutes}m${
        entry.timeLeft.seconds
      }s`
    );
    this.entries.push(entry);
  }

  getHistory() {
    //    console.log(JSON.stringify(this.entries));
    console.log(this.history);
    return this.history;
  }
}

export default PomodoroHistory;
