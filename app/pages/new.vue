<template>
  <div class="flex flex-col justify-center">
    <h1 class="p-4 text-center">Auto-import from URL</h1>
    <form
      class="flex flex-col items-center mt-4 gap-y-4"
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
            class="w-full pb-2 text-3xl placeholder-gray-300 border-b-2 border-gray-100 focus:outline-none"
            placeholder="Untitled Document..."
          />
        </div>

        <!-- Source URL -->
        <div>
          <label for="sourceUrl">Source Url</label>
          <input
            id="sourceUrl"
            type="text"
            v-model="sourceUrl"
            class="w-full p-2 border border-gray-300 rounded font-verdana"
            placeholder="Url"
          />
        </div>

        <!-- Description -->
        <div>
          <label for="description">Description</label>
          <input
            id="description"
            type="text"
            v-model="description"
            class="w-full p-2 border border-gray-300 rounded font-verdana"
            placeholder="Url"
          />
        </div>
      </div>

      <!-- Text Editor -->
      <div class="w-full pt-4 m-4 text-center border border-gray-300 rounded">
        <label for="documentBody">Article Text Body</label>
        <ClientOnly>
          <EditorComponent :onEditorReady="handleEditorReady" />
        </ClientOnly>
      </div>

      <!-- Submit Button -->
      <button type="submit" class="p-2 mt-4 text-white bg-blue-500 rounded">
        Submit
      </button>
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
