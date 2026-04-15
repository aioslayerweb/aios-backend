import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      kpi_metrics: {
        Row: {
          id: string;
          metric_name: string;
          value: number;
          change_percent: number;
          period: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          metric_name: string;
          value: number;
          change_percent: number;
          period: string;
          created_at?: string;
        };
      };
      ai_insights: {
        Row: {
          id: string;
          title: string;
          body: string;
          action_label: string;
          action_type: string;
          priority: string;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          body: string;
          action_label: string;
          action_type: string;
          priority?: string;
          is_active?: boolean;
          created_at?: string;
        };
      };
    };
  };
};
