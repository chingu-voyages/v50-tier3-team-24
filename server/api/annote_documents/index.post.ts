import { AnnoteDocumentDbClient } from "~~/server/utils/database/annote-document-db-client/annote-document-db-client";
import { AnnoteDocument } from "~~/types/annote-document/annote-document";
import { ApiResponse } from "~~/types/api-response/api-response";

// This is a placeholder right now for phase 1 - API should accept a post request and insert a annote_document into the table
// POST request body should also be validated at some point
export default defineEventHandler<Promise<ApiResponse>>(async (event) => {
  const requestBody = await readBody<Partial<AnnoteDocument>>(event);
  const dbClient = new AnnoteDocumentDbClient();
  const apiResponse = {} as ApiResponse;

  try {
    await dbClient.insertDocument(requestBody);
    setResponseStatus(event, 201);
    apiResponse.status = "ok";
    return apiResponse;
  } catch (error: any) {
    apiResponse.status = "fail";
    setResponseStatus(event, 500);
    apiResponse.error = createError({
      statusCode: 500,
      statusMessage: error.message,
    });
    return apiResponse;
  }
});
