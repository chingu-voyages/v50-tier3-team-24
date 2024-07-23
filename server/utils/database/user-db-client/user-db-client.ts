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

  public async signup(
    email: string,
    password: string,
    username: string,
    first_name: string,
    last_name: string
  ): Promise<User> {
    const { data: authData, error: authError } = await this.client.auth.signUp({
      email,
      password,
    });

    if (authError) {
      throw new Error(authError.message);
    }

    const newUser: User = {
      user_id: authData.user?.id as string,
      username,
      first_name,
      last_name,
      email,
      password,
      created_at: new Date(),
      updated_at: new Date(),
    };

    const { data: insertedData, error: insertError } = await this.client
      .from(this.TABLE_NAME)
      .insert(newUser);

    if (insertError) {
      throw new Error(insertError.message);
    }

    return insertedData![0];
  }

  public async login(email: string, password: string): Promise<any> {
    const { data, error } = await this.client.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }
}
