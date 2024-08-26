export function useSticky() {
  /**
   * This composable fetches all of the stickies associated with a specific AnnoteDocument
   * @param id the AnnoteDocument id to which the sticky belongs
   * @returns
   */
  async function fetchStickies(id: string): Promise<Sticky[]> {
    try {
      const { data: apiResponse } = await $fetch<ApiResponse<Sticky[]>>(
        `/api/annote_documents/${id}/sticky`
      );
      return apiResponse || [];
    } catch (error: any) {
      console.error(error.message);
    }
    return [];
  }

  return { fetchStickies };
}
