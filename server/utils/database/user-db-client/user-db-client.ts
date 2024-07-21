import { User } from "~~/types/user/user";
import { BaseDbClient } from "../base-db-client";

export class UserDbClient extends BaseDbClient {
  private readonly TABLE_NAME = "users";

  public async insertUser(user: Partial<User>): Promise<void> {
    const { error } = await this.client.from(this.TABLE_NAME).insert(user);

    if (error) throw new Error(error.message);
  }

  public async getAllUsers(): Promise<User[]> {
    const { data, error } = await this.client.from(this.TABLE_NAME).select("*");

    if (error) throw new Error(error.message);

    return data || [];
  }

  public async getUserById(userId: number): Promise<User | null> {
    const { data, error } = await this.client
      .from(this.TABLE_NAME)
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) throw new Error(error.message);

    return data || null;
  }
}
