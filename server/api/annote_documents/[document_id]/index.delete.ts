import { serverSupabaseUser } from "#supabase/server";
import { AnnoteDocumentDbClient } from "~/server/utils/database/annote-document-db-client/annote-document-db-client";
import { checkDocumentExists } from "~/server/utils/database/annote-document-db-client/check-document-exists";
import { StickyDbClient } from "~/server/utils/database/sticky-db-client/sticky-db-client";

// This route deletes an annote document by its ID. It should also delete all annotations associated with the document.
export default defineEventHandler(async (event) => {
  const document_id = getRouterParam(event, "document_id");
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

  // Check if the document exists. If not, return 404
  if (!(await checkDocumentExists(user.id, document_id!))) {
    setResponseStatus(event, 404);
    return {
      status: "fail",
      error: createError({
        statusCode: 404,
        statusMessage: `Document with id ${document_id} not found`,
      }),
    };
  }

  try {
    // Two database operations need to be performed: one to delete the document and one to delete all annotations associated with the document.
    // Let's delete the stickies first
    const stickyDbClient = new StickyDbClient();

    await stickyDbClient.deleteStickyById(user.id, document_id!);

    // Now delete the document
    const annoteDocumentDbClient = new AnnoteDocumentDbClient();
    await annoteDocumentDbClient.deleteDocumentById(user.id, document_id!);
    setResponseStatus(event, 201);
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
