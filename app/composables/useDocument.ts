export function useDocument() {
  async function deleteDocument(id: string) {
    const res = await useFetch(`/api/annote_documents/${id}`, {
      method: "DELETE",
    });

    return res.data.value;
  }
  function isMarkerInViewPort(htmlElement: HTMLElement): boolean {
    // Reference: https://jacobnarayan.com/blogs/how-to-tell-if-an-html-element-is-in-the-viewport
    const rect = htmlElement.getBoundingClientRect();

    const isinview =
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <=
        (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth);

    // returns true or false based on whether or not the element is in viewport
    return isinview;
  }
  return { deleteDocument, isMarkerInViewPort };
}
