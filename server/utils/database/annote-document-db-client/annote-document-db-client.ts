import type { AnnoteDocument } from "~/types/annote-document/annote-document";
import type { EditorJsBlock } from "~/types/annote-document/editjs-block";
import { BaseDbClient } from "../base-db-client";

export class AnnoteDocumentDbClient extends BaseDbClient {
  constructor() {
    super("annote_document");
  }

  public async insertDocument(document: {
    title: string;
    blocks: EditorJsBlock[];
    slug: string;
    description?: string;
    source_url?: string;
    user_id: string;
  }): Promise<AnnoteDocument> {
    const { data, error } = await this.client
      .from(this.TABLE_NAME)
      .insert(document)
      .select();

    if (error) throw new Error(error.message);
    return data?.[0];
  }

  public async getAllDocuments(user_id: string): Promise<AnnoteDocument[]> {
    // TODO: Implement pagination
    // TODO: Once we have user authentication, we should only return documents that belong to the user

    const { data, error } = await this.client
      .from(this.TABLE_NAME)
      .select("*")
      .eq("user_id", user_id);

    if (error) throw new Error(error.message);

    return data || [];
  }

  public async getDocumentById(
    user_id: string,
    document_id: string
  ): Promise<AnnoteDocument | null> {
    const { data, error } = await this.client
      .from(this.TABLE_NAME)
      .select("*")
      .match({ document_id: document_id });

    if (error) throw new Error(error.message);

    return data?.[0] || null;
  }

  public async updateDocumentTitleById(
    document_id: string,
    title: string,
    slug: string,
    user_id: string
  ): Promise<AnnoteDocument> {
    const { data, error } = await this.client
      .from(this.TABLE_NAME)
      .update({ title: title, slug: slug })
      .match({ document_id: document_id, user_id: user_id })
      .select();

    if (error) throw new Error(error.message);
    return data?.[0];
  }

  public async updateDocumentBlocksById(
    id: string,
    blocks: EditorJsBlock[]
  ): Promise<AnnoteDocument> {
    const { data, error } = await this.client
      .from(this.TABLE_NAME)
      .update({ blocks: blocks })
      .eq("document_id", id)
      .select();
    if (error) throw new Error(error.message);
    return data?.[0];
  }

  public async getDocumentsBySlugStringPattern(
    pattern: string
  ): Promise<AnnoteDocument[]> {
    const { data, error } = await this.client
      .from(this.TABLE_NAME)
      .select()
      .like("slug", pattern);

    if (error) throw new Error(error.message);
    return data || [];
  }
}
