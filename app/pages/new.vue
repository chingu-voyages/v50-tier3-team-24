<template>
  <div class="containerWidth">
    <form
      class="flex flex-col mt-4 gap-y-4"
      @submit.prevent="handleSubmit"
    >
      <!-- Import From Source Section-->
      <div>
        <!-- Document Title -->
        <div class="mb-4">
          <input
            id="documentTitle"
            v-model="documentTitle"
            required
            type="text"
            class="w-full pb-2 text-3xl placeholder-gray-300 border-b-2 border-gray-100 focus:outline-none font-verdana"
            placeholder="Untitled Document..."
          />
        </div>

        <!-- TODO - Add Cover Image Functionality -->
        <div class="mb-4">
          <div
            class="flex items-center justify-center px-6 pt-2 pb-2 border-2 border-gray-300 border-dashed rounded-md"
          >
            <Icon name="mdi:plus-circle-outline" :style="{ color: '#75D3D4'}" />
            <p class="pl-1 text-gray-300">Add cover image</p>
          </div>
        </div>

        <!-- Source URL . This is commented out because URL scraping is not functioning now. -->
        <div class="mb-4 hidden">
          <div class="flex">
            <Icon class="mr-2 self-center" name="mdi:link" :style="{ color: '#75D3D4'}" />
            <!-- <label for="sourceUrl">Source Url</label> -->
            <input
              id="sourceUrl"
              type="text"
          
              class="w-full text-base bg-transparent border-none focus:outline-none !font-cabin"
              placeholder="Type or paste a link here to get started."
            />
          </div>
        </div>
        <!-- User manually enters the source url  -->
        <div>
          <input
            id="sourceUrl"
            type="text"
            v-model="sourceUrl"
            class="w-full p-2 border border-gray-300 rounded font-verdana border-none focus:outline-none"
            placeholder="Source URL..."
          />
        </div>

        <!-- Description -->
        <div>
          <input
            id="description"
            type="text"
            v-model="description"
            class="w-full p-2 border border-gray-300 rounded font-verdana border-none focus:outline-none"
            placeholder="Description"
          />
        </div>
      </div>

      <!-- Text Editor -->
      <div class="w-full pt-4 m-4 border border-gray-300 rounded">
        <ClientOnly>
          <EditorComponent :onEditorReady="handleEditorReady" />
        </ClientOnly>
      </div>

      <!-- Submit Button -->  
       <div class="w-20 h-10 ml-4 mb-8">
         <button type="submit" class="p-2 mt-4 text-white bg-[#03A58D] rounded font-cabin">
           <Icon name="mdi:check" class="self-center" :style="{ color: '#fafafa'}" />
           Done
         </button>
       </div>
    </form>

    <!-- Error message -->
    <div class="text-center">
      <p v-if="apiError">{{ apiError }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from "#imports";
import { ref } from "vue";

const router = useRouter();

const documentTitle = ref("");
const sourceUrl = ref("");
const description = ref("");

const apiError = ref<string | null | undefined>(null);
const editorController = ref<CustomEditorJs | null>(null);

async function handleSubmit() {
  const outputData = await editorController.value?.save();
  try {
    const { data: apiResponse } = await useFetch<ApiResponse<AnnoteDocument>>(
      "/api/annote_documents",
      {
        method: "POST",
        body: {
          title: documentTitle.value,
          blocks: outputData?.blocks,
          source_url: sourceUrl.value,
          description: description.value,
        },
      }
    );

    if (apiResponse.value?.error) {
      apiError.value = apiResponse.value?.error.statusMessage;
      return;
    }

    const { slug, document_id } = apiResponse.value?.data!;

    await router.push(`/library/${slug}/edit?id=${document_id}`);
  } catch (err: any) {
    apiError.value = err.message;
  }
}

function handleEditorReady(editor: CustomEditorJs) {
  editorController.value = editor;
}
</script>
<style scoped>
  .containerWidth {
    max-width: 960px;
  }
</style>