import { AnnoteDocumentDbClient } from "./annote-document-db-client";

export async function checkDocumentExists(
  document_id: string
): Promise<boolean> {
  const dbClient = new AnnoteDocumentDbClient();
  const annoteDocument = await dbClient.getDocumentById(document_id);
  return !!annoteDocument;
}
