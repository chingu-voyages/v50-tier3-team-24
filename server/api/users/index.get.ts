import { UserDbClient } from "~/server/utils/database/user-db-client/user-db-client";
import { ApiResponse } from "~/types/api-response/api-response";
import { User } from "~/types/user/user";

export default defineEventHandler<Promise<ApiResponse<User[]>>>(
  async (event) => {
    const dbClient = new UserDbClient();
    const apiResponse = {} as ApiResponse<User[]>;

    try {
      const users = await dbClient.getAllUsers();
      apiResponse.status = "ok";
      apiResponse.data = users;
    } catch (error: any) {
      apiResponse.status = "fail";
      setResponseStatus(event, 500);

      apiResponse.error = createError({
        statusCode: 500,
        statusMessage: error.message,
      });
    }

    return apiResponse;
  }
);
