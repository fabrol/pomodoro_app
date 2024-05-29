import { Session, SupabaseClient } from "@supabase/supabase-js";
import { Database, Tables, Enums, TablesInsert } from "./types/database.types";

export type Time = {
  minutes: number;
  seconds: number;
};

type PomodoroEntry = Tables<"pomos">;
interface PomodoroHistoryProps {
  supabase: SupabaseClient<Database>;
  history: PomodoroEntry[];
  setHistory: (history: PomodoroEntry[]) => void;
}

class PomodoroHistory {
  private history: PomodoroEntry[];
  private setHistory: (history: PomodoroEntry[]) => void;
  private supabase: SupabaseClient<Database>;

  constructor(props: PomodoroHistoryProps) {
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
        .from("pomos")
        .select("*")
        .eq("user_id", user_id);

      if (error) {
        throw error;
      }

      if (!data) {
        console.log("No data found");
        return;
      }

      if (Array.isArray(data)) {
        this.setHistory(data);
        console.log("Setting history to:", data);
      } else {
        console.error(
          "Expected history to be an array but received:",
          typeof data
        );
      }
    } catch (error) {
      console.error("Error fetching Pomodoro history:", error);
    }
  };

  async addEntry(options: {
    pomodoroIndex: number;
    timeLeft: Time;
    userId: string;
    pomoCat: string;
    pomoDurationMin: number;
  }) {
    const entry: TablesInsert<"pomos"> = {
      ended_at: new Date().toISOString(),
      pomo_index: options.pomodoroIndex,
      time_left_minutes: options.timeLeft.minutes,
      time_left_seconds: options.timeLeft.seconds,
      pomo_cat: options.pomoCat,
      pomo_duration_min: options.pomoDurationMin,
      user_id: options.userId,
    };
    console.log(
      `Timestamp=${entry.ended_at}, PomodoroIndex=${entry.pomo_index}, TimeLeft=${entry.time_left_minutes}m${entry.time_left_seconds}s`
    );

    // Insert this record into supabase table pomos
    const { error } = await this.supabase.from("pomos").insert(entry);
    if (error) {
      console.error("Error inserting pomo into history:", error);
    }
  }
}

export default PomodoroHistory;
export type { PomodoroEntry };
