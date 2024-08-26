import { serverSupabaseUser } from "#supabase/server";
import { StickyDbClient } from "~/server/utils/database/sticky-db-client/sticky-db-client";
import { updateStickyValidator } from "~/server/utils/validators/sticky/update-sticky-validator";
import type { StickyUpdateActionData } from "~/types/sticky/sticky-action-data/sticky-action-data";

export default defineEventHandler(async (event) => {
  const sticky_id = getRouterParam(event, "sticky_id");

  // Handle patch request for specific sticky
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

  const requestBody = await readBody<StickyUpdateActionData>(event);

  // Validate the requestbody
  try {
    await updateStickyValidator.validate(requestBody, {
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
    const stickyData = await client.updateStickyById(
      user.id,
      sticky_id!,
      requestBody
    );

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
