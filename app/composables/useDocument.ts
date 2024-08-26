export function useDocument() {
  async function deleteDocument(id: string) {
    const res = await useFetch(`/api/annote_documents/${id}`, {
      method: "DELETE",
    });

    return res.data.value;
  }
  return { deleteDocument };
}
