<template>
  <div class="containerWidth">
    <form class="flex flex-col mt-4 gap-y-4" @submit.prevent="handleSubmit">
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
            <Icon
              name="mdi:plus-circle-outline"
              :style="{ color: '#75D3D4' }"
            />
            <p class="pl-1 text-gray-300">Add cover image</p>
          </div>
        </div>

        <!-- Source URL . This is commented out because URL scraping is not functioning now. -->
        <div class="mb-4">
          <div class="flex">
            <Icon class="self-center mr-2" name="mdi:link" :style="{ color: '#75D3D4'}" />
            <input
              id="autoImportUrl"
              type="text"
              class="w-full text-base bg-transparent border-none focus:outline-none !font-cabin"
              placeholder="Type or paste a link here to get started."
              v-model="sourceUrl"
            />
            <button
              type="button"
              class="p-2 mt-4 text-xs md:text-sm xl:text-base text-white bg-[#03A58D] rounded font-cabin h-10 w-28 lg:h-12 lg:w-32 disabled:bg-gray-400"
              :disabled="!isAutoImportUrlValid"
              @click="handleAutoImport"
            >
              <Icon
                name="mdi:file-import-outline"
                class="self-center"
                :style="{ color: '#fafafa' }"
              />
              Auto import
            </button>
          </div>
        </div>
        <!-- User manually enters the source url  -->
        <div class="hidden">
          <input
            id="sourceUrl"
            type="text"
            v-model="sourceUrl"
            class="w-full p-2 border border-gray-300 border-none rounded font-verdana focus:outline-none"
            placeholder="Source URL..."
          />
        </div>

        <!-- Description -->
        <div>
          <input
            id="description"
            type="text"
            v-model="description"
            class="w-full p-2 border border-gray-300 border-none rounded font-verdana focus:outline-none"
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
      <div class="w-20 h-10 mb-8 ml-4">
        <button
          type="submit"
          class="p-2 mt-4 text-white bg-[#03A58D] rounded font-cabin"
        >
          <Icon
            name="mdi:check"
            class="self-center"
            :style="{ color: '#fafafa' }"
          />
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
import { validateUrl } from "../utils/web-scraper/validators/url-validator";

const router = useRouter();

const documentTitle = ref("");
const sourceUrl = ref("");
const description = ref("");

const apiError = ref<string | null | undefined>(null);
const editorController = ref<CustomEditorJs | null>(null);
useHead({ title: "New Document | Annote" });

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

const isAutoImportUrlValid = computed<boolean>(() => {
  return validateUrl(sourceUrl.value);
});

async function handleAutoImport() {
  // TODO: - Implement URL scraping

}

</script>
<style scoped>
.containerWidth {
  max-width: 960px;
}
</style>
