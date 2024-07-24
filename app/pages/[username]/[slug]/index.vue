<template>
  <div>
    <div class="max-w-screen-md">
      <header>
        <div class="flex gap-2">
          <h1 class="font-verdana font-bold text-3xl text-justify">{{ annoteDocument?.title }}</h1>
          <ShareLinkButtons :link-url="`/library/${annoteDocument?.slug}/edit?id=${annoteDocument?.document_id}`" />
        </div>
        <NuxtLink :to="annoteDocument?.source_url" target="_blank">
          <div class="flex gap-2 mt-2 mb-2">
            <Icon name="mdi:arrow-top-right-thin-circle-outline" style="color: #787878" size="20px" />
            <p class="font-verdana greyLinkColor">{{ annoteDocument?.source_url }}</p>
          </div>
        </NuxtLink>
      </header>
      <main>
        <p class="font-verdana">{{  annoteDocument?.body }}</p>
      </main>
    </div>
  </div>
</template>
<script setup lang="ts">
  const route = useRoute();  
  const annoteDocument = ref<AnnoteDocument | null>(null);

  const documentId = route.query.id;
  if (documentId) {
    const { data: apiResponse } = await useFetch<ApiResponse<AnnoteDocument>>(`/api/annote_documents/${documentId}`);
    annoteDocument.value = apiResponse.value?.data!;
  }
</script>