import { Session, SupabaseClient } from "@supabase/supabase-js";
import { Database, Tables, Enums, TablesInsert } from "./types/database.types";

export type Time = {
  minutes: number;
  seconds: number;
};

/*
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
*/

type PomodoroEntry = Tables<"pomos">;
interface PomodoroHistoryProps {
  supabase: SupabaseClient<Database>;
  history: PomodoroEntry[];
  setHistory: (history: PomodoroEntry[]) => void;
}

class PomodoroHistory {
  private entries: PomodoroEntry[];
  private history: PomodoroEntry[];
  private setHistory: (history: PomodoroEntry[]) => void;
  private supabase: SupabaseClient<Database>;

  constructor(props: PomodoroHistoryProps) {
    this.entries = [];
    this.history = props.history;
    this.setHistory = props.setHistory;
    this.supabase = props.supabase;

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
        //this.setHistory(data[0].history.map(parseJsonToPomodoroEntry));
        console.log("Setting history to:", data[0].history);
      } else {
        console.error(
          "Expected history to be an array but received:",
          typeof data[0].history
        );
      }
    } catch (error) {
      console.error("Error fetching Pomodoro history:", error);
    }
  };

  async addEntry(options: {
    pomodoroIndex: number;
    completed: boolean;
    timeLeft: Time;
    userId: string;
    pomoCat: string;
    pomoDurationMin: number;
  }) {
    const entry: TablesInsert<"pomos"> = {
      ended_at: new Date().toISOString(),
      pomo_index: options.pomodoroIndex,
      completed: options.completed,
      time_left_minutes: options.timeLeft.minutes,
      time_left_seconds: options.timeLeft.seconds,
      pomo_cat: options.pomoCat,
      pomo_duration_min: options.pomoDurationMin,
      user_id: options.userId,
    };
    console.log(
      `Timestamp=${entry.ended_at}, PomodoroIndex=${entry.pomo_index}, Completed=${entry.completed}, TimeLeft=${entry.time_left_minutes}m${entry.time_left_seconds}s`
    );

    // Insert this record into supabase table pomos
    const { error } = await this.supabase.from("pomos").insert(entry);
    if (error) {
      console.error("Error inserting pomo into history:", error);
    }
  }

  getHistory() {
    //    console.log(JSON.stringify(this.entries));
    console.log("getting history:", this.history);
    return this.history;
  }
}

export default PomodoroHistory;
export type { PomodoroEntry };
