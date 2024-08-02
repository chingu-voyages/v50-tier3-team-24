import { Sticky } from "~/types/sticky/sticky-types";
import { BaseDbClient } from "../base-db-client";

export class StickyDbClient extends BaseDbClient {
  constructor() {
    super("sticky");
  }
  public async insertSticky(sticky: Partial<Sticky>): Promise<void> {
    console.log;
  }
}
