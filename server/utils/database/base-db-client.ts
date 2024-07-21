import { createClient, SupabaseClient } from "@supabase/supabase-js";

export class BaseDbClient {
  protected client: SupabaseClient;

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Supabase URL and key must be provided");
    }

    this.client = createClient(supabaseUrl, supabaseKey);
  }
}
