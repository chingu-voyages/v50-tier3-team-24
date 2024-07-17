import { AnnoteDocumentDbClient } from "~~/server/utils/database/annote-document-db-client/annote-document-db-client";
import { AnnoteDocument } from "~~/types/annote-document/annote-document";
import { ApiResponse } from "~~/types/api-response/api-response";

export default defineEventHandler<Promise<ApiResponse<AnnoteDocument[]>>>(
  async (event) => {
    const dbClient = new AnnoteDocumentDbClient();
    const apiResponse = {} as ApiResponse<AnnoteDocument[]>;

    try {
      const documents = await dbClient.getAllDocuments();
      apiResponse.data = documents;
      apiResponse.status = "ok";
      return apiResponse;
    } catch (error: any) {
      setResponseStatus(event, 500);
      apiResponse.status = "fail";
      apiResponse.error = createError({
        statusCode: 500,
        statusMessage: error.message,
      });
      return apiResponse;
    }
  }
);
