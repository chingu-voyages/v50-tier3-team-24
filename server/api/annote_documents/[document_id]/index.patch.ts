import { AnnoteDocumentDbClient } from "~/server/utils/database/annote-document-db-client/annote-document-db-client";
import { AnnoteDocument } from "~/types/annote-document/annote-document";
import { ApiResponse } from "~/types/api-response/api-response";

export default defineEventHandler<Promise<ApiResponse<AnnoteDocument>>>(
  async (event) => {
    // Update an existing annote_document's title.
    /* 
    1. When the title is updated, the slug should also be updated. We need to create a slug based on the title.
    2. Slugs need to be unique. If the slug already exists, we should append a number to the end of the slug.
  */

    const { title, body } = await readBody<{ title: string; body: string }>(
      event
    );
    const document_id = getRouterParam(event, "document_id");

    try {
      const dbClient = new AnnoteDocumentDbClient();

      const existingDocument = await dbClient.getDocumentById(document_id!);
      // Check if the document exists.
      if (!existingDocument) {
        setResponseStatus(event, 404);
        return {
          status: "fail",
          error: createError({
            statusCode: 404,
            statusMessage: `Document with ID ${document_id} not found`,
          }),
        };
      }

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

      if (body) {
        const updatedDocument = await dbClient.updatedDocumentBodyById(
          document_id!,
          body
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
    return {
      status: "fail",
      error: createError({
        statusCode: 400,
        statusMessage: "Bad Request",
      }),
    };
  }
);

/**
 * Should create a slug based on the title of the document and should increment an integer tag at the end if there is a duplicate
 * @param title the title of the document
 * @returns
 */
async function createSlugFromDocumentTitle(title: string): Promise<string> {
  // Convert to lower case, remove diacritics and replace spaces with hyphens. Remove any non-alphanumeric characters.
  const baseSlug = title
    .replace(/[.,\/#!$%\^&\*\]\;:{}=\-_`~()]/g, "")
    .replace(/[^a-zA-Z0-9]-/g, " ")
    .replace(/\s/g, "-")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  const dbClient = new AnnoteDocumentDbClient();
  // Find documents with similar patthern.
  // If there is no matching docs with the baseSlug, then the baseSlug is unique and can be returned
  const matchingDocuments = await dbClient.getDocumentsBySlugStringPattern(
    `${baseSlug}%`
  );
  if (matchingDocuments.length === 0) {
    return baseSlug;
  }

  // If there are matching documents, find documents that end with a dash and a number
  // We'll use the number of docs found as a count for the tag at the end of a slug
  const integerAppending: number =
    matchingDocuments.filter((doc) => {
      return doc.slug.match(/-\d+$/);
    }).length + 1;
  return `${baseSlug}-${integerAppending}`;
}
