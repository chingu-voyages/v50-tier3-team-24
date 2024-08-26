import type { User } from "~/types/user/user";
import { BaseDbClient } from "../base-db-client";

export class UserDbClient extends BaseDbClient {
  constructor() {
    super("users");
  }

  public async insertUser(user: Partial<User>): Promise<void> {
    const { error } = await this.client.from(this.TABLE_NAME).insert(user);

    if (error) throw new Error(error.message);
  }

  public async getAllUsers(): Promise<User[]> {
    const { data, error } = await this.client.from(this.TABLE_NAME).select("*");

    if (error) throw new Error(error.message);

    return data || [];
  }

  public async getUserById(userId: string): Promise<User | null> {
    const { data, error } = await this.client
      .from(this.TABLE_NAME)
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) throw new Error(error.message);

    return data || null;
  }

  public async login(email: string, password: string): Promise<User> {
    const { data, error } = await this.client.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw new Error(error.message);

    if (!data.user) throw new Error("User not found");

    const userData = await this.getUserById(data.user.id);

    if (!userData) throw new Error("User data not found");

    return userData;
  }

  public async updateUsernameByUserId(
    user_id: string,
    updateData: {
      username: string;
    }
  ): Promise<void> {
    const { error } = await this.client
      .from(this.TABLE_NAME)
      .update(updateData)
      .eq("user_id", user_id);

    if (error) throw new Error(error.message);
  }

  public async updatePassword(user_id: string, password: string) {
    const { error } = await this.client.auth.admin.updateUserById(user_id, {
      password: password,
    });

    if (error) throw new Error(error.message);
  }
}
