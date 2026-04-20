<template>
  <div class="containerWidth">
    <form class="flex flex-col mt-4 gap-y-4" @submit.prevent="handleSubmit">
      <!-- Import From Source Section-->
      <div>
        <!-- Document Title -->
        <div class="mb-4">
          <input id="documentTitle" v-model="documentTitle" required type="text"
            class="w-full pb-2 text-3xl placeholder-gray-300 border-b-2 border-gray-100 focus:outline-none font-verdana p-2"
            placeholder="Untitled Document..." />
        </div>

        <!-- TODO - Add Cover Image Functionality -->
        <div class="mb-4">
          <div
            class="flex items-center justify-center px-6 pt-2 pb-2 border-2 border-gray-300 border-dashed rounded-md">
            <Icon name="mdi:plus-circle-outline" :style="{ color: '#75D3D4' }" />
            <p class="pl-1 text-gray-300">Add cover image</p>
          </div>
        </div>

        <!-- Source URL -->
        <div class="mb-4">
          <div class="flex items-center gap-2">
            <div class="link-input-group flex flex-1 items-center overflow-hidden rounded-md">
              <span class="link-icon flex h-full items-center px-3">
                <Icon name="mdi:link" :style="{ color: '#75D3D4' }" />
              </span>
              <input id="autoImportUrl" type="text"
                class="link-input w-full border-none p-2 text-base !font-cabin focus:outline-none"
                placeholder="Type or paste a link here to get started." v-model="sourceUrl" />
            </div>
            <button type="button"
              class="h-10 w-28 rounded bg-[#03A58D] p-2 font-cabin text-xs text-white disabled:bg-gray-400 xl:text-sm lg:h-12 lg:w-32"
              :disabled="!isAutoImportUrlValid" @click="handleAutoImport">
              <Icon name="mdi:file-import-outline" class="self-center" :style="{ color: '#fafafa' }" />
              Auto import
            </button>
          </div>
          <p v-if="hasImportError" class="text-red-500 text-xs">{{ hasImportError }}</p>
        </div>
        <!-- User manually enters the source url  -->
        <div class="hidden">
          <input id="sourceUrl" type="text" v-model="sourceUrl"
            class="w-full p-2 border border-gray-300 border-none rounded font-verdana focus:outline-none"
            placeholder="Source URL..." />
        </div>

        <!-- Description -->
        <div>
          <input id="description" type="text" v-model="description"
            class="w-full p-2 border border-gray-300 border-none rounded font-verdana focus:outline-none"
            placeholder="Description" />
        </div>
      </div>

      <!-- Text Editor -->
      <div class="w-full pt-4 border border-gray-300 rounded">
        <ClientOnly>
          <EditorComponent :onEditorReady="handleEditorReady" />
        </ClientOnly>
      </div>
      <!-- visibility setting  -->
      <div>
        <input id="visibility" type="checkbox" v-model="isVisible" />
        <label for="visibility" class="text-base ml-2">Public</label>
      </div>
      <!-- Submit Button -->
      <div class="w-20 h-10">
        <SpinnerButton :isBusy="isBusy" title="Done" class="p-2 mt-4 text-white bg-[#03A58D] rounded font-cabin" />
      </div>
    </form>

    <!-- Error message -->
    <div class="text-center text-red-500">
      <p v-if="apiError">{{ apiError }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from "#imports";
import { ref } from "vue";
import { type HeaderData, EditorJsBlockType } from "~/types/annote-document/editjs-block";
import { validateUrl } from "~/utils/web-scraper/validators/url-validator";

const router = useRouter();

const documentTitle = ref("");
const sourceUrl = ref("");
const description = ref("");

const apiError = ref<string | null | undefined>(null);
const editorController = ref<CustomEditorJs | null>(null);

const isBusy = ref<boolean>(false);
const hasImportError = ref<string | null>(null);

const isVisible = ref<boolean>(false);

useHead({ title: "New Document | Annote" });

async function handleSubmit() {
  const outputData = await editorController.value?.save();
  if (outputData?.blocks.length === 0) {
    apiError.value = "The document can't be empty: please add some content.";
    return;
  }

  try {
    isBusy.value = true;
    const { data: apiResponse } = await useFetch<ApiResponse<AnnoteDocument>>(
      "/api/annote_documents",
      {
        method: "POST",
        body: {
          title: documentTitle.value,
          blocks: outputData?.blocks,
          source_url: sourceUrl.value,
          description: description.value,
          visibility: isVisible.value ? "public" : "private",
        },
      }
    );

    if (apiResponse.value?.error) {
      apiError.value = apiResponse.value?.error.statusMessage;
      return;
    }

    const { slug, document_id } = apiResponse.value?.data!;

    await router.push(`/library/${slug}/edit?id=${document_id}`);
    isBusy.value = false;
  } catch (err: any) {
    apiError.value = err.message;
    isBusy.value = false;
  }
}

function handleEditorReady(editor: CustomEditorJs) {
  editorController.value = editor;
}

const isAutoImportUrlValid = computed<boolean>(() => {
  return validateUrl(sourceUrl.value);
});

async function handleAutoImport() {
  isBusy.value = true;
  hasImportError.value = null;

  const res = await useFetch<ApiResponse<EditorJsBlock[]>>("/api/scrape", {
    method: "POST",
    body: {
      url: sourceUrl.value,
    },
  });

  if (res.data.value?.status !== "ok") {
    renderAutoImportError("Unable to auto-import from the provided URL.");
    isBusy.value = false;
    return;
  }

  // Render the editor with the received data
  const { data } = res.data.value;

  if (!data || data.length === 0) {
    isBusy.value = false;
    renderAutoImportError("Sorry, we can't extract any content from the provided URL.");
    return;
  }

  editorController.value?.blocks.render({ blocks: data });
  const headerBlock: HeaderData = data?.find((block) => block.type === EditorJsBlockType.Header)?.data as HeaderData
  if (headerBlock?.level === 1) {
    documentTitle.value = headerBlock.text;
  }
  isBusy.value = false;
}

function renderAutoImportError(errorMessage: string) {
  hasImportError.value = errorMessage;
}
</script>
<style scoped>
.containerWidth {
  max-width: 960px;
}

.link-input-group {
  background-color: var(--app-surface-soft);
  border: 1px solid var(--app-border);
  color: var(--app-text);
}

.link-icon {
  background-color: var(--app-surface-soft);
  color: var(--app-text-muted);
}

.link-input {
  background-color: transparent;
  color: var(--app-text);
}

.link-input::placeholder {
  color: var(--app-text-muted);
  opacity: 0.85;
}
</style>
