import { serverSupabaseUser } from "#supabase/server";
import { StickyDbClient } from "~/server/utils/database/sticky-db-client/sticky-db-client";

// This route handles deleting a sticky note by its ID.
// Only the user who created the sticky note can delete it.
export default defineEventHandler(async (event) => {
  const sticky_id = getRouterParam(event, "sticky_id");

  // This is the id of the user making the request
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

  // Find the sticky by ID
  try {
    const client = new StickyDbClient();

    const stickyInQuestion = await client.getStickyById(sticky_id!);

    if (!stickyInQuestion) {
      setResponseStatus(event, 404);
      return {
        status: "fail",
        error: createError({
          statusCode: 404,
          statusMessage: "Sticky not found",
        }),
      };
    }

    // If it doesn't belong to the user, return a 403
    if (stickyInQuestion.user_id !== user.id) {
      setResponseStatus(event, 403);
      return {
        status: "fail",
        error: createError({
          statusCode: 403,
          statusMessage: "Deleting this sticky is forbidden",
        }),
      };
    }

    await client.deleteStickyById(user.id, sticky_id!);
    return {
      status: "ok",
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
