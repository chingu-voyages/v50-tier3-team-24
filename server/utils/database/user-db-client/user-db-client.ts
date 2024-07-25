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
}
