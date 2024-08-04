import { UserDbClient } from "~/server/utils/database/user-db-client/user-db-client";
import type { ApiResponse } from "~/types/api-response/api-response";
import type { User } from "~/types/user/user";

export default defineEventHandler<Promise<ApiResponse>>(async (event) => {
  const requestBody = await readBody<Partial<User>>(event);
  const dbClient = new UserDbClient();
  const apiResponse = {} as ApiResponse;

  try {
    const user = await dbClient.insertUser(requestBody);
    setResponseStatus(event, 201);
    apiResponse.status = "ok";
    apiResponse.data = user;
  } catch (error: any) {
    apiResponse.status = "fail";
    setResponseStatus(event, 500);

    apiResponse.error = createError({
      statusCode: 500,
      statusMessage: error.message,
    });
  }

  return apiResponse;
});
