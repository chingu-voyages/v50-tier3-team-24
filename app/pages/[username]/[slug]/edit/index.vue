<template>
  <div>
    <div class="flex">
      <input
        type="text"
        v-model="documentTitle"
        @blur="handleDocumentTitleBlur"
        class="w-full p-2 border border-gray-300 rounded font-verdana"
        placeholder="Title"
      />
      <div class="flex items-center gap-2 ml-2">
        <Icon name="mdi:check" />
        <Icon name="mdi:trash-can-outline" />
      </div>
    </div>
    <div class="flex bg-gray-100 border border-gray-300 rounded p-5 min-h-[300px] my-5">
      <ClientOnly>
        <EditorComponent :onEditorReady="handleEditorReady" :onMarkerInserted="handleMarkerInserted" />
      </ClientOnly>
      <div>
        <Transition>
          <div v-if="isInsertingNewAnnotation" id="new-sticky-container p-2">
            <!-- This is for new annotation stickes -->
            <StickyNote 
              :isNew="isInsertingNewAnnotation" 
              :color="newStickyData?.color!" 
              :pinNumber="newStickyData?.pinNumber!" 
              :documentId="newStickyData?.documentId!" 
              :title="newStickyData?.title"
              :onUpdateCreate="handleUpdateCreateSticky"
              :onCancel="handleCloseOutSticky"
              :uuid="newStickyData?.uuid"
            />
          </div>
        </Transition>
        <div class="flex">
          <StickyNote 
            v-for="sticky in stickies" :key="sticky.sticky_id"
            :stickyData="sticky" 
            :color="sticky.color" 
            :pinNumber="sticky.anchor" 
            :documentId="sticky.document_id" 
            :readonly="true"
            :onDelete="handleDeleteSticky"
            :uuid="sticky.sticky_id"
            :canEdit="true"
            :onUpdateCreate="handleUpdateCreateSticky"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ActionType } from '~/types/sticky/action-type/action-type';
import type { StickyCreateActionData, StickyUpdateActionData } from '~/types/sticky/sticky-action-data/sticky-action-data';
import type { LinkSticky, Sticky, VideoSticky } from '~/types/sticky/sticky-types';
import type { AnnoteOnMarkerInsertedData } from '../../../../utils/annote-marker/definitions/types';

const annoteDocument = ref<AnnoteDocument | null>(null);
const documentTitle = ref("");
const editorController = ref<CustomEditorJs | null>(null);

const initialDocumentTitle = ref(""); // The original title when the document loads. This will not change.
const route = useRoute();

const isInsertingNewAnnotation = ref(false);
const newStickyData = ref<{ pinNumber: number; color: string; title: string, documentId: string, uuid: string } | null>(null);

const stickies = ref<Sticky[]>([]);
const { fetchStickies } = useSticky();

const { id } = route.query;

async function handleDocumentTitleBlur() {
  // This function handles when the user clicks out of the title input field
  // It should send a patch request to the server to update the document title
  // The documentTitleField can't be empty. If it is, how do we handle the error?
  // TODO: Handle the error when the document title is empty

  if (documentTitle.value === initialDocumentTitle.value) return;

  if (documentTitle.value.trim() === "") return;

  const { data: apiResponse } = await useFetch<ApiResponse<AnnoteDocument>>(
    `/api/annote_documents/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify({ title: documentTitle.value }),
    }
  );

  const { slug, document_id } = apiResponse.value?.data!;

  await navigateTo({
    path: `/library/${slug}/edit`,
    query: {
      id: document_id,
    },
  });

}

async function patchAnnoteDocumentBlocks(): Promise<AnnoteDocument> {
  const blockData = await editorController.value?.save();

  const { data: apiResponse } = await useFetch<ApiResponse<AnnoteDocument>>(
    `/api/annote_documents/${id}`,
    {
      method: "PATCH",
      body: { blocks: blockData?.blocks },
    }
  );
  return apiResponse.value?.data!;
}

if (id) {
  const { data: apiResponse } = await useFetch<ApiResponse<AnnoteDocument>>(
    `/api/annote_documents/${id}`
  );
  annoteDocument.value = apiResponse.value?.data!;
  initialDocumentTitle.value = annoteDocument.value.title;
  documentTitle.value = annoteDocument.value.title;

  stickies.value = await fetchStickies(id);
}

function handleMarkerInserted (data?: AnnoteOnMarkerInsertedData) {
  if (!data) {
    console.warn("No data was returned. Aborting");
    return;
  }
  isInsertingNewAnnotation.value = true;
  const { pinNumber, color, text, uuid } = data!;
  newStickyData.value = { pinNumber, color, title: text || "", documentId: annoteDocument.value?.document_id!, uuid };
}

function handleEditorReady(editor: CustomEditorJs) {
  editorController.value = editor;
  editor.isReady.then(() => {
    editor.render({
      blocks: annoteDocument.value?.blocks as any,  
    });
  });
}

async function handleUpdateCreateSticky(action: ActionType, values: StickyCreateActionData | StickyUpdateActionData): Promise<void> {
  const { sticky_id } = (values as StickyCreateActionData);
  const { document_id, title, body, anchor, color, sticky_type, source_url } = values;
  const httpBody = { document_id, title, body, color, anchor, sticky_type, sticky_id, source_url };
  const endPoint = action === "create" ? "/api/sticky" : `/api/sticky/${sticky_id}`;

  await useFetch<ApiResponse<Sticky | VideoSticky | LinkSticky>>(
    endPoint,
    {
      method: action === "create" ? "POST" : "PATCH",
      body: httpBody
    }
  );
  annoteDocument.value = await patchAnnoteDocumentBlocks();
  stickies.value = await fetchStickies(id);
  isInsertingNewAnnotation.value = false;
  newStickyData.value = null;
}

function handleCloseOutSticky () {
  isInsertingNewAnnotation.value = false;
  newStickyData.value = null;
  
  // This should re-render the editor to the last fetched-from-API state, undoing the new marker. TODO: It's hacky
  editorController.value?.render({
    blocks: annoteDocument.value?.blocks as any,
  })
}

async function handleDeleteSticky (sticky_id: string) {
  console.log("hi")
  await useFetch<ApiResponse<Sticky>>(
    `/api/sticky/${sticky_id}`,
    {
      method: "DELETE",
    }
  );
  annoteDocument.value = await patchAnnoteDocumentBlocks();
  stickies.value = await fetchStickies(id);
}
</script>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>