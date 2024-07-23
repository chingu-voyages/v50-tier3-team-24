import { AnnoteDocumentDbClient } from "../database/annote-document-db-client/annote-document-db-client";

/**
 * Should create a slug based on the title of the document and should increment an integer tag at the end if there is a duplicate
 * @param title the title of the document
 * @returns
 */
export async function createSlugFromDocumentTitle(
  title: string
): Promise<string> {
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
