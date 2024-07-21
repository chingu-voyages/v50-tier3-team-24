import { AnnoteDocumentDbClient } from "~~/server/utils/database/annote-document-db-client/annote-document-db-client";
import { AnnoteDocument } from "~~/types/annote-document/annote-document";
import { ApiResponse } from "~~/types/api-response/api-response";

export default defineEventHandler<Promise<ApiResponse<AnnoteDocument>>>(
  async (event) => {
    // `/api/annote_documents/:document_id`; GET an annote document by ID
    // TODO: the route parameter should be validated
    const document_id = parseInt(
      getRouterParam(event, "document_id") as string,
      10
    );

    const dbClient = new AnnoteDocumentDbClient();
    const apiResponse = {} as ApiResponse<AnnoteDocument>;
    const annoteDocument = await dbClient.getDocumentById(document_id);
    if (!annoteDocument) {
      // If no document is found, return a 404
      setResponseStatus(event, 404);
      apiResponse.status = "fail";
      apiResponse.error = createError({
        statusCode: 404,
        statusMessage: `Document with ID ${document_id} not found`,
      });
      return apiResponse;
    }

    return { status: "ok", data: annoteDocument };
  }
);
