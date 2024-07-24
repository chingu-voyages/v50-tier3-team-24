import { AnnoteDocument } from "~~/types/annote-document/annote-document";
import { BaseDbClient } from "../base-db-client";

export class AnnoteDocumentDbClient extends BaseDbClient {
  private readonly TABLE_NAME = "annote_document";

  public async insertDocument(document: {
    title: string;
    body: string;
    slug: string;
    description?: string;
    source_url?: string;
  }): Promise<AnnoteDocument> {
    const { data, error } = await this.client
      .from(this.TABLE_NAME)
      .insert(document)
      .select();

    if (error) throw new Error(error.message);
    return data?.[0];
  }

  public async getAllDocuments(): Promise<AnnoteDocument[]> {
    // TODO: Implement pagination
    // TODO: Once we have user authentication, we should only return documents that belong to the user

    const { data, error } = await this.client.from(this.TABLE_NAME).select("*");

    if (error) throw new Error(error.message);

    return data || [];
  }

  public async getDocumentById(id: string): Promise<AnnoteDocument | null> {
    const { data, error } = await this.client
      .from(this.TABLE_NAME)
      .select("*")
      .eq("document_id", id);

    if (error) throw new Error(error.message);

    return data?.[0] || null;
  }

  public async updateDocumentTitleById(
    id: string,
    title: string,
    slug: string
  ): Promise<AnnoteDocument> {
    const { data, error } = await this.client
      .from(this.TABLE_NAME)
      .update({ title: title, slug: slug })
      .eq("document_id", id)
      .select();

    if (error) throw new Error(error.message);
    return data?.[0];
  }

  public async updatedDocumentBodyById(
    id: string,
    body: string
  ): Promise<AnnoteDocument> {
    const { data, error } = await this.client
      .from(this.TABLE_NAME)
      .update({ body: body })
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
