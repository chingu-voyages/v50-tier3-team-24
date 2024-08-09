<template>
  <div class="flex flex-col justify-center">
    <h1 class="p-4 text-2xl text-center">Auto-import from URL</h1>
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
            class="w-full pb-2 text-3xl placeholder-gray-300 border-b-2 border-gray-100 focus:outline-none font-verdana"
            placeholder="Untitled Document..."
          />
        </div>

        <!-- TODO - Add Cover Image Functionality -->
        <div class="mb-4">
          <div
            class="flex items-center justify-center px-6 pt-5 pb-4 border-2 border-gray-300 border-dashed rounded-md"
          >
            <img :src="addCircleIcon" alt="Icon" class="w-8 h-8" />
            <p class="pl-1 text-gray-300">Add cover image</p>
          </div>
        </div>

        <!-- Source URL -->
        <div>
          <p class="pb-2 text-sm text-gray-300">
            Type or paste a link here to get started.
          </p>
          <div class="flex">
            <Icon class="mr-2" name="mdi:link" />
            <!-- <label for="sourceUrl">Source Url</label> -->
            <input
              id="sourceUrl"
              type="text"
              v-model="sourceUrl"
              class="w-full text-sm bg-transparent border-none focus:outline-none font-cabin"
              placeholder="Add link..."
            />
          </div>
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
        <label for="documentBody" class="text-2xl">Article Text Body</label>
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
import addCircleIcon from "@/public/assets/icons/add_circle.svg";
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
