import { serverSupabaseUser } from "#supabase/server";
import { AnnoteDocumentDbClient } from "~/server/utils/database/annote-document-db-client/annote-document-db-client";
import { createSlugFromDocumentTitle } from "~/server/utils/slug/create-slug-from-document-title";
import { createDocumentValidator } from "~/server/utils/validators/document/create-document-validator";
import type { AnnoteDocument } from "~/types/annote-document/annote-document";
import type { EditorJsBlock } from "~/types/annote-document/editjs-block";
import type { ApiResponse } from "~/types/api-response/api-response";

// This is a placeholder right now for phase 1 - API should accept a post request and insert a annote_document into the table
// POST request body should also be validated at some point
export default defineEventHandler<Promise<ApiResponse<AnnoteDocument>>>(
  async (event) => {
    let user = null;

    // TODO: There has to be a better way to guard this route
    try {
      user = await serverSupabaseUser(event);
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
    } catch (error: any) {
      return {
        status: "fail",
        error: createError({
          statusCode: 401,
          statusMessage: error.message,
        }),
      };
    }

    const requestBody = await readBody<{
      title: string;
      blocks: EditorJsBlock[];
      description?: string;
      source_url?: string;
    }>(event);

    // Validate the request body using   a yup validator schema
    try {
      await createDocumentValidator.validate(requestBody, {
        abortEarly: false,
      });
    } catch (error: any) {
      setResponseStatus(event, 400);
      return {
        status: "fail",
        error: createError({
          statusCode: 400,
          statusMessage: error,
        }),
      };
    }

    const { title, blocks, description, source_url } = requestBody;

    try {
      const slug = await createSlugFromDocumentTitle(title);
      const dbClient = new AnnoteDocumentDbClient();
      const insertedDocument = await dbClient.insertDocument({
        title,
        blocks,
        slug,
        description,
        source_url,
        user_id: user.id,
      });
      setResponseStatus(event, 201);

      return {
        status: "ok",
        data: insertedDocument,
      };
    } catch (error: any) {
      return {
        status: "fail",
        error: createError({
          statusCode: 500,
          statusMessage: error.message,
        }),
      };
    }
  }
);
