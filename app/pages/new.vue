<template>
  <div>
    <div class="p-4 border-b-2 border-gray-100">
      <h1>Auto-import from URL</h1>
    </div>
    <div class="max-w-screen-md mt-4">
      <form @submit.prevent="handleSubmit">
        <div class="flex flex-col gap-y-4">
          <div>
            <label for="documentTitle">Title</label>
            <input id="documentTitle" required type="text" v-model="documentTitle" class="w-full p-2 border border-gray-300 rounded font-verdana" placeholder="Title" />
          </div>
          <div>
            <label for="sourceUrl">Source Url</label>
            <input id="sourceUrl" type="text" v-model="sourceUrl" class="w-full p-2 border border-gray-300 rounded font-verdana" placeholder="Url" />
          </div>
          
          <div>
            <label for="description">Description</label>
            <input id="description" type="text" v-model="description" class="w-full p-2 border border-gray-300 rounded font-verdana" placeholder="Url" />
          </div>
          
          <div>
            <label for="documentBody">Article Text Body</label>
            <ClientOnly>
               <EditorComponent :onEditorReady="handleEditorReady" />
            </ClientOnly>
          </div>

          <div>
            <button type="submit" class="bg-blue-500 text-white p-2 rounded mt-4">Submit</button>
          </div>
        </div>
      </form>
      <div>
        <p v-if="apiError">{{ apiError }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'nuxt/app';
import { ref } from 'vue';

  const router = useRouter();

  const documentTitle = ref("");
  const sourceUrl = ref("");
  const description = ref("");

  const apiError = ref<string | null | undefined>(null);
  const editorController = ref<CustomEditorJs | null>(null);

  // TODO: We should validate the input on the front end
  async function handleSubmit () {
    const outputData = await editorController.value?.save();  
    try {  
      const { data: apiResponse } = await useFetch<ApiResponse<AnnoteDocument>>("/api/annote_documents", {
        method: "POST",
        body: {
          title: documentTitle.value,
          blocks: outputData?.blocks,
          source_url: sourceUrl.value,
          description: description.value
        }
      });

      // Handle errors
      if (apiResponse.value?.error) {
        apiError.value = apiResponse.value?.error.statusMessage;
        return;
      }

      /* If the request is successful, a new document should have been created and returned
       we should redirect the user to the document page */
      const { slug, document_id } = apiResponse.value?.data!;

      console.log(slug, document_id);
    
      await router.push(`/library/${slug}/edit?id=${document_id}`);
      
    } catch (err: any) {
      apiError.value = err.message;
    }
  }

  function handleEditorReady(editor: CustomEditorJs) {
    editorController.value = editor;
  }
</script>
