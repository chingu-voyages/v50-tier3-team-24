import { createSlugFromDocumentTitle } from "~/server/utils/slug/create-slug-from-document-title";
import { createDocumentValidator } from "~/server/utils/validators/document/create-document-validator";
import { AnnoteDocumentDbClient } from "~~/server/utils/database/annote-document-db-client/annote-document-db-client";
import { ApiResponse } from "~~/types/api-response/api-response";

// This is a placeholder right now for phase 1 - API should accept a post request and insert a annote_document into the table
// POST request body should also be validated at some point
export default defineEventHandler<Promise<ApiResponse>>(async (event) => {
  const requestBody = await readBody<{ title: string; body: string }>(event);

  // Validate the request body using a yup validator schema
  try {
    await createDocumentValidator.validate(requestBody, { abortEarly: false });
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

  const { title, body } = requestBody;

  try {
    const slug = await createSlugFromDocumentTitle(title);
    const dbClient = new AnnoteDocumentDbClient();
    const apiResponse = {} as ApiResponse;

    await dbClient.insertDocument({ title, body, slug });
    setResponseStatus(event, 201);
    apiResponse.status = "ok";
    return apiResponse;
  } catch (error: any) {
    return {
      status: "fail",
      error: createError({
        statusCode: 500,
        statusMessage: error.message,
      }),
    };
  }
});
