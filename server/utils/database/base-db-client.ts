import { createClient, SupabaseClient } from "@supabase/supabase-js";

export abstract class BaseDbClient {
  protected client: SupabaseClient;
  protected readonly TABLE_NAME: string;
  constructor(tableName: string) {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;

    this.TABLE_NAME = tableName;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Supabase URL and key must be provided");
    }

    this.client = createClient(supabaseUrl, supabaseKey);
  }
}
