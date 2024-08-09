import type {
  LinkSticky,
  Sticky,
  VideoSticky,
} from "~/types/sticky/sticky-types";
import { BaseDbClient } from "../base-db-client";

export class StickyDbClient extends BaseDbClient {
  constructor() {
    super("sticky");
  }

  public async insertSticky(
    user_id: string,
    stickyData: Partial<Sticky | LinkSticky | VideoSticky>
  ): Promise<Sticky | VideoSticky | LinkSticky | null> {
    const { error, data } = await this.client
      .from(this.TABLE_NAME)
      .insert({ ...stickyData, user_id })
      .select();

    if (error) throw new Error(error.message);
    return data?.[0] || null;
  }

  public async updateStickyById(
    user_id: string,
    sticky_id: string,
    stickyData: Partial<Sticky | VideoSticky | LinkSticky>
  ): Promise<Sticky | VideoSticky | LinkSticky> {
    const { error, data } = await this.client
      .from(this.TABLE_NAME)
      .update(stickyData)
      .match({ sticky_id, user_id })
      .select();

    if (error) throw new Error(error.message);
    return data?.[0];
  }

  public async getAllStickiesByDocumentId(
    user_id: string,
    document_id: string
  ): Promise<Sticky[]> {
    const { data, error } = await this.client
      .from(this.TABLE_NAME)
      .select("*")
      .eq("document_id", document_id)
      .order("created_at", { ascending: true });

    if (error) throw new Error(error.message);

    return data || [];
  }

  public async deleteStickyById(
    user_id: string,
    sticky_id: string
  ): Promise<void> {
    const { error, data } = await this.client
      .from(this.TABLE_NAME)
      .delete()
      .match({ sticky_id, user_id });

    if (error) throw new Error(error.message);
  }

  public async getStickyById(sticky_id: string): Promise<Sticky> {
    const { data, error } = await this.client
      .from(this.TABLE_NAME)
      .select("*")
      .eq("sticky_id", sticky_id);

    if (error) throw new Error(error.message);

    return data?.[0];
  }
}
