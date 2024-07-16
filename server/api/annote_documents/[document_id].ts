import { AnnoteDocumentDbClient } from "~~/server/utils/database/annote-document-db-client/annote-document-db-client";
export default defineEventHandler(async (event) => {
  // `/api/annote_documents/:document_id`; GET an annote document by ID

  const document_id = parseInt(
    getRouterParam(event, "document_id") as string,
    10
  );
  const dbClient = new AnnoteDocumentDbClient();

  const annoteDocument = await dbClient.getDocumentById(document_id);
  if (!annoteDocument) {
    // TODO: As per nuxt docs, createError is the proper way to throw a server error.
    // When hitting this end-point with Postman and intentionally passing an invalid ID, the error message is not being returned
    // and the server crashes. Need to investigate
    throw createError({
      statusCode: 404,
      message: `Document with ID ${document_id} not found`,
    });
  }

  return { data: annoteDocument };
});
