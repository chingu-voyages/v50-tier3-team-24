export function useSticky() {
  async function fetchStickies(id: string): Promise<Sticky[]> {
    const { data: apiResponse } = await useFetch<ApiResponse<Sticky[]>>(
      `/api/annote_documents/${id}/sticky`
    );
    return apiResponse.value?.data!;
  }

  return { fetchStickies };
}
