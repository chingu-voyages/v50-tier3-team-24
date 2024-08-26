import { serverSupabaseUser } from "#supabase/server";
import { UserDbClient } from "~/server/utils/database/user-db-client/user-db-client";
import type { ApiResponse } from "~/types/api-response/api-response";
import type { User } from "~/types/user/user";

// Patch endpoint allows users to update the username and their password
export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event);

  if (!user) {
    setResponseStatus(event, 401);
    return {
      status: "fail",
      error: createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
      }),
    };
  }

  const requestBody = await readBody<{ username?: string; password?: string }>(
    event
  );

  const dbClient = new UserDbClient();
  const apiResponse = {} as ApiResponse<User>;

  const targetUser = await dbClient.getUserById(user.id);

  if (!targetUser) {
    setResponseStatus(event, 404);
    apiResponse.status = "fail";
    apiResponse.error = createError({
      statusCode: 404,
      statusMessage: `User not found`,
    });
    return apiResponse;
  }

  // Update the user's username
  if (requestBody.username) {
    try {
      await dbClient.updateUsernameByUserId(user.id, {
        username: requestBody.username,
      });
      return { status: "ok" };
    } catch (error: any) {
      setResponseStatus(event, 500);
      apiResponse.status = "fail";
      apiResponse.error = createError({
        statusCode: 500,
        statusMessage: error.message,
      });
      return apiResponse;
    }
  }

  // Update the user's password
  if (requestBody.password) {
    try {
      await dbClient.updatePassword(user.id, requestBody.password);
      return { status: "ok" };
    } catch (error: any) {
      setResponseStatus(event, 500);
      apiResponse.status = "fail";
      apiResponse.error = createError({
        statusCode: 500,
        statusMessage: error.message,
      });
      return apiResponse;
    }
  }
});
