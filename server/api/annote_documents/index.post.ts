import { AnnoteDocumentDbClient } from "~~/server/utils/database/annote-document-db-client/annote-document-db-client";
import { AnnoteDocument } from "~~/types/annote-document/annote-document";

// This is a placeholder right now for phase 1 - API should accept a post request and insert a annote_document into the table
// POST request body should also be validated at some point
export default defineEventHandler(async (event) => {
  const requestBody = await readBody<Partial<AnnoteDocument>>(event);
  const dbClient = new AnnoteDocumentDbClient();

  try {
    await dbClient.insertDocument(requestBody);
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    });
  }

  setResponseStatus(event, 201);

  return {
    status: "ok",
  };
});
