<template>
  <div>
    <div class="flex bg-gray-100 border border-gray-300 rounded p-5 min-h-[300px] my-5">
      <div>
        <header>
          <div class="flex gap-2">
            <h1 class="font-verdana font-bold text-3xl text-justify">{{ annoteDocument?.title }}</h1>
            <ShareLinkButtons v-if="currentUser?.data?.username === username" :link-url="`${annoteDocument?.slug}/edit?id=${annoteDocument?.document_id}`" />
          </div>
          <NuxtLink :to="annoteDocument?.source_url" target="_blank">
            <div class="flex gap-2 mt-2 mb-2">
              <Icon name="mdi:arrow-top-right-thin-circle-outline" style="color: #787878" size="20px" />
              <p class="font-verdana greyLinkColor">{{ annoteDocument?.source_url }}</p>
            </div>
          </NuxtLink>
        </header>
        <ClientOnly>
          <EditorComponent :onEditorReady="handleEditorReady" :readOnly="true" />
        </ClientOnly>
      </div>
      <div>
        <div class="flex flex-wrap">
          <StickyNote 
            :readonly="true"
            v-for="sticky in stickies" :key="sticky.sticky_id"
            :stickyData="sticky"
            :pinNumber="sticky.anchor" 
            :documentId="sticky.document_id"             
            :uuid="sticky.sticky_id"
            :color="sticky.color"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">

  const route = useRoute();  
  const annoteDocument = ref<AnnoteDocument | null>(null);
  const editorController = ref<CustomEditorJs | null>(null);
  const stickies = ref<Sticky[]>([]); // These will be readonly stickies
  const { fetchStickies } = useSticky();
  const { getCurrentUser } = useAuth();
  
  const currentUser = await getCurrentUser();

  const { id } = route.query;
  const { username } = route.params;

  if (id) {
    const { data: apiResponse } = await useFetch<ApiResponse<AnnoteDocument>>(`/api/annote_documents/${id}`);
    annoteDocument.value = apiResponse.value?.data!;

     stickies.value = await fetchStickies(id as string);
  }

  function handleEditorReady(editor: CustomEditorJs) {
    editor.isReady.then(() => {
      editorController.value = editor;
      editorController.value.render({
        blocks: annoteDocument.value?.blocks || [],
      });
    });
  }
</script>