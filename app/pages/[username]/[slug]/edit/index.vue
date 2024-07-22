<template>
  <div>
    <header>
      <div class="max-w-screen-md">
        <input type="text" v-model="(annoteDocument as AnnoteDocument).title" class="w-full p-2 border border-gray-300 rounded font-verdana" placeholder="Title" />
      </div>
    </header>
    <main>
      <textarea v-model="(annoteDocument as AnnoteDocument).body" class="w-full p-2 border border-gray-300 rounded font-verdana" placeholder="Body">
      </textarea>
    </main>
  </div>
</template>

<script setup lang="ts">
  const annoteDocument = ref<AnnoteDocument | "">("");
  
  const route = useRoute();
  const { id } = route.query;
  
  if (id) {
    const { data: fetchedDocument } = await useFetch<ApiResponse<AnnoteDocument>>(`/api/annote_documents/${id}`);
    annoteDocument.value = fetchedDocument.value?.data!;
  }
</script>