import { AnnoteDocumentDbClient } from "./annote-document-db-client";

export async function checkDocumentExists(
  user_id: string,
  document_id: string
): Promise<boolean> {
  const dbClient = new AnnoteDocumentDbClient();
  const annoteDocument = await dbClient.getDocumentById(user_id, document_id);
  return !!annoteDocument;
}
