import { LinkSticky, Sticky, VideoSticky } from "~/types/sticky/sticky-types";
import { BaseDbClient } from "../base-db-client";

export class StickyDbClient extends BaseDbClient {
  constructor() {
    super("sticky");
  }

  public async insertSticky(
    user_id: string,
    stickyData: Partial<Sticky>
  ): Promise<Sticky | VideoSticky | LinkSticky | null> {
    const { error, data } = await this.client
      .from(this.TABLE_NAME)
      .insert({ ...stickyData, user_id })
      .select();

    if (error) throw new Error(error.message);
    return data?.[0] || null;
  }
}
