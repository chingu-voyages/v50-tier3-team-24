import { defineEventHandler, readBody } from "h3";
import { UserDbClient } from "~~/server/utils/database/user-db-client/user-db-client";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, password, username, first_name, last_name } = body;
  const userDbClient = new UserDbClient();

  try {
    const user = await userDbClient.signup(
      email,
      password,
      username,
      first_name,
      last_name
    );
    return { user };
  } catch (error: any) {
    return { error: error.message };
  }
});
