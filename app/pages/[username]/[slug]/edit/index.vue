<template>
  <div>
    <div>
      <div class="max-w-screen-md">
        <div class="flex">
          <input type="text" v-model="documentTitle" @blur="handleDocumentTitleBlur" class="w-full p-2 border border-gray-300 rounded font-verdana" placeholder="Title" />
          <div class="flex gap-2 ml-2 items-center">
            <Icon name="mdi:check" />
            <Icon name="mdi:trash-can-outline" /> 
          </div>
        </div>
        <textarea v-model="documentBody" @blur="handleDocumentBodyBlur" class="w-full p-2 border border-gray-300 rounded font-verdana mt-4" placeholder="Body">
        </textarea>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  const annoteDocument = ref<AnnoteDocument | null>(null);
  const documentTitle = ref("");
  const documentBody = ref("");

  const initialDocumentTitle = ref(""); // The original title when the document loads. This will not change.
  const route = useRoute();
  const { id } = route.query;

  async function handleDocumentTitleBlur () {
    // This function handles when the user clicks out of the title input field
    // It should send a patch request to the server to update the document title
    // The documentTitleField can't be empty. If it is, how do we handle the error?
    // TODO: Handle the error when the document title is empty

    if (documentTitle.value === initialDocumentTitle.value) return;

    if (documentTitle.value.trim() === "") return;
    
    const { data: apiResponse } = await useFetch<ApiResponse<AnnoteDocument>>(`/api/annote_documents/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ title: documentTitle.value }),
    });

    const { slug, document_id } = apiResponse.value?.data!;

    await navigateTo({
      path: `/library/${slug}/edit`,
      query: {
        id: document_id
      }
    });  
  }

  async function handleDocumentBodyBlur () {
    // This function handles when the user clicks out of the body textarea
    // It should send a patch request to the server to update the document body
    // The documentBody should be validated but I won't check for empty string here

    const { data: apiResponse } = await useFetch<ApiResponse<AnnoteDocument>>(`/api/annote_documents/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ body: documentBody.value }),
    });

    documentBody.value = apiResponse.value?.data!.body!;
  }
  
  if (id) {
    const { data: apiResponse } = await useFetch<ApiResponse<AnnoteDocument>>(`/api/annote_documents/${id}`);
    annoteDocument.value = apiResponse.value?.data!;
    initialDocumentTitle.value = annoteDocument.value.title;
    documentTitle.value = annoteDocument.value.title;
    documentBody.value = annoteDocument.value.body;
  }

</script>