import { serverSupabaseUser } from "#supabase/server";
import { AnnoteDocumentDbClient } from "~/server/utils/database/annote-document-db-client/annote-document-db-client";
import { checkDocumentExists } from "~/server/utils/database/annote-document-db-client/check-document-exists";
import { createSlugFromDocumentTitle } from "~/server/utils/slug/create-slug-from-document-title";
import { updateDocumentValidator } from "~/server/utils/validators/document/update-document-validator";
import type { AnnoteDocument } from "~/types/annote-document/annote-document";
import type { EditorJsBlock } from "~/types/annote-document/editjs-block";
import type { ApiResponse } from "~/types/api-response/api-response";

export default defineEventHandler<Promise<ApiResponse<AnnoteDocument>>>(
  async (event) => {
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

    const requestBody = await readBody<{
      title: string;
      blocks: EditorJsBlock[];
      visibility: "public" | "private";
    }>(event);

    // Validate the request body
    try {
      await updateDocumentValidator.validate(requestBody, {
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

    const { title, blocks, visibility } = requestBody;

    try {
      const dbClient = new AnnoteDocumentDbClient();
      // This is structured so that we can only patch one field at a time.
      if (title) {
        const newSlug = await createSlugFromDocumentTitle(title.trim());
        const updatedDocument = await dbClient.updateDocumentTitleById(
          document_id!,
          title,
          newSlug,
          user.id
        );

        return { status: "ok", data: updatedDocument };
      }

      if (blocks) {
        const updatedDocument = await dbClient.updateDocumentBlocksById(
          document_id!,
          blocks
        );

        return { status: "ok", data: updatedDocument };
      }

      if (visibility) {
        const updatedDocument = await dbClient.updateDocumentVisibilityById(
          user.id,
          document_id!,
          visibility
        );
        return { status: "ok", data: updatedDocument };
      }
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
    throw new Error("Invalid request body");
  }
);
