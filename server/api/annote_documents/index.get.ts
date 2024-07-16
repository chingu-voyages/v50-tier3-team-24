import { AnnoteDocumentDbClient } from "~~/server/utils/database/annote-document-db-client/annote-document-db-client";

export default defineEventHandler(async () => {
  const dbClient = new AnnoteDocumentDbClient();

  try {
    const documents = await dbClient.getAllDocuments();
    return { data: documents };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message,
    });
  }
});
