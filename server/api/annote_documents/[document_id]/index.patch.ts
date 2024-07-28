import { AnnoteDocumentDbClient } from "~/server/utils/database/annote-document-db-client/annote-document-db-client";
import { checkDocumentExists } from "~/server/utils/database/annote-document-db-client/check-document-exists";
import { createSlugFromDocumentTitle } from "~/server/utils/slug/create-slug-from-document-title";
import { updateDocumentValidator } from "~/server/utils/validators/document/update-document-validator";
import { AnnoteDocument } from "~/types/annote-document/annote-document";
import { EditorJsBlock } from "~/types/annote-document/editjs-block";
import { ApiResponse } from "~/types/api-response/api-response";

export default defineEventHandler<Promise<ApiResponse<AnnoteDocument>>>(
  async (event) => {
    const document_id = getRouterParam(event, "document_id");

    const requestBody = await readBody<{
      title: string;
      blocks: EditorJsBlock[];
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
          statusMessage: JSON.stringify(error),
        }),
      };
    }

    // Check if the document exists. If not, return 404
    if (!(await checkDocumentExists(document_id!))) {
      setResponseStatus(event, 404);
      return {
        status: "fail",
        error: createError({
          statusCode: 404,
          statusMessage: `Document with id ${document_id} not found`,
        }),
      };
    }

    const { title, blocks } = requestBody;

    try {
      const dbClient = new AnnoteDocumentDbClient();
      // This is structured so that we can only patch one field at a time.
      if (title) {
        const newSlug = await createSlugFromDocumentTitle(title.trim());
        const updatedDocument = await dbClient.updateDocumentTitleById(
          document_id!,
          title,
          newSlug
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
