import { defineEventHandler, readBody } from "h3";
import { UserDbClient } from "~~/server/utils/database/user-db-client/user-db-client";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { email, password } = body;
  const userDbClient = new UserDbClient();

  try {
    const session = await userDbClient.login(email, password);
    return { session };
  } catch (error: any) {
    return { error: error.message };
  }
});
