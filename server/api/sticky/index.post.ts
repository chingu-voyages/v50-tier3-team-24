import { serverSupabaseUser } from "#supabase/server";
import { StickyDbClient } from "~/server/utils/database/sticky-db-client/sticky-db-client";
import { createStickyValidator } from "~/server/utils/validators/sticky/create-sticky-validator";
import type { StickyCreateActionData } from "~/types/sticky/sticky-action-data/sticky-action-data";

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

  const requestBody = await readBody<StickyCreateActionData>(event);

  // Validate the requestbody
  try {
    await createStickyValidator.validate(requestBody, {
      abortEarly: false,
    });
  } catch (error: any) {
    setResponseStatus(event, 400);
    return {
      status: "fail",
      error: createError({
        statusCode: 400,
        statusMessage: error.message,
      }),
    };
  }

  try {
    const client = new StickyDbClient();
    const stickyData = await client.insertSticky(user.id, requestBody);
    return {
      status: "ok",
      data: stickyData,
    };
  } catch (error: any) {
    setResponseStatus(event, 500);
    return {
      status: "fail",
      error: createError({
        statusCode: 500,
        statusMessage: error.message,
      }),
    };
  }
});
