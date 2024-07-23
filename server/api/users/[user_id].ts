import { UserDbClient } from "~~/server/utils/database/user-db-client/user-db-client";
import { ApiResponse } from "~~/types/api-response/api-response";
import { User } from "~~/types/user/user";

export default defineEventHandler<Promise<ApiResponse<User>>>(async (event) => {
  // `/api/users/:user_id`; GET a user by ID
  const user_id = getRouterParam(event, "user_id") as string;

  const dbClient = new UserDbClient();
  const apiResponse = {} as ApiResponse<User>;
  const user = await dbClient.getUserById(user_id);

  if (!user) {
    setResponseStatus(event, 404);
    apiResponse.status = "fail";
    apiResponse.error = createError({
      statusCode: 404,
      statusMessage: `User with ID ${user_id} not found`,
    });
    return apiResponse;
  }

  return { status: "ok", data: user };
});
