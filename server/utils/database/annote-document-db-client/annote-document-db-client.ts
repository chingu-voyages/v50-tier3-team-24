import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { AnnoteDocument } from "~~/types/annote-document/annote-document";

// When we start dealing with the user table, I think we can refactor this to inherit from a base class?
export class AnnoteDocumentDbClient {
  private client: SupabaseClient;
  private readonly TABLE_NAME = "annote_document";

  constructor() {
    this.client = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_KEY!
    );
  }

  private async createTableIfNotExist() {
    // Run a function that will create the table if it doesn't exist
    const { error } = await this.client.rpc("create_annote_document_table");
    if (error) throw new Error(error.message);
  }

  public async insertDocument(
    document: Partial<AnnoteDocument>
  ): Promise<void> {
    await this.createTableIfNotExist();

    const { error } = await this.client.from(this.TABLE_NAME).insert(document);

    if (error) throw new Error(error.message);
  }
}
