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
        <button class="hover:custom-green">
          <Icon name="mdi:check" />
        </button>
        <button class="hover:text-[#F64C00]" @click="toggleConfirmDeleteWindow">
          <Icon name="mdi:trash-can-outline" />
        </button>
      </div>
    </div>
    <div class="flex bg-gray-100 border border-gray-300 rounded p-5 min-h-[300px] my-5">
      <ClientOnly>
        <EditorComponent :onEditorReady="handleEditorReady" :onMarkerInserted="handleMarkerInserted" :onMarkerDeleted="handleDeleteMarker" :onLostFocus="handleEditorLostFocus" />
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
        <div class="flex flex-wrap">
          <!-- This is rendering the existing stickies in readonly mode, but can be edited if they click the menu option -->
          <TransitionGroup>
            <StickyNote 
              v-for="sticky in stickies" :key="sticky.sticky_id"
              :stickyData="sticky" 
              :color="sticky.color" 
              :pinNumber="sticky.anchor" 
              :documentId="sticky.document_id" 
              :readonly="true"
              :uuid="sticky.sticky_id"
              :canEdit="true"
              :onUpdateCreate="handleUpdateCreateSticky"
            />
          </TransitionGroup>
        </div>
      </div>
    </div>
    <DeleteConfirmModal :open="confirmDeleteWindowOpen" :onClose="toggleConfirmDeleteWindow" :onDelete="handleDeleteDocument" />
  </div>
</template>

<script setup lang="ts">
import { isEqual } from 'lodash';
import type { AnyBlockType } from '~/types/annote-document/editjs-block';
import type { ActionType } from '~/types/sticky/action-type/action-type';
import type { StickyCreateActionData, StickyUpdateActionData } from '~/types/sticky/sticky-action-data/sticky-action-data';
import type { LinkSticky, Sticky, VideoSticky } from '~/types/sticky/sticky-types';
import type { AnnoteOnMarkerInsertedData, AnnotteOnMarkerDeletedData } from '../../../../utils/annote-marker/definitions/types';

const annoteDocument = ref<AnnoteDocument | null>(null);

// The comparison document is going to be used to determine if there are changes in the document
const annoteComparisonDocument = ref<AnnoteDocument | null>(null);

const documentTitle = ref("");
const editorController = ref<CustomEditorJs | null>(null);

const initialDocumentTitle = ref(""); // The original title when the document loads. This will not change.
const route = useRoute();

const isInsertingNewAnnotation = ref(false);
const newStickyData = ref<{ pinNumber: number; color: string; title: string, documentId: string, uuid: string } | null>(null);

const stickies = ref<Sticky[]>([]);
const { fetchStickies } = useSticky();

const confirmDeleteWindowOpen = ref(false);
const { deleteDocument } = useDocument();
const router = useRouter();

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
  annoteComparisonDocument.value = apiResponse.value?.data!;

  initialDocumentTitle.value = annoteDocument.value.title;
  documentTitle.value = annoteDocument.value.title;

  stickies.value = await fetchStickies(id as string);
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
  
  await syncAnnoteDocumentData();

  stickies.value = await fetchStickies(id as string);
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

function toggleConfirmDeleteWindow() {
  confirmDeleteWindowOpen.value = !confirmDeleteWindowOpen.value;
}

async function handleDeleteSticky (sticky_id: string) {
  await useFetch<ApiResponse<Sticky>>(
    `/api/sticky/${sticky_id}`,
    {
      method: "DELETE",
    }
  );
  
  await syncAnnoteDocumentData();
  
  stickies.value = await fetchStickies(id as string);
}

async function handleEditorLostFocus() {
  // This function handles the click away event from the editor and sends the patch request to
  const newBlockData = await editorController.value?.save();
  const oldBlockData = annoteComparisonDocument.value?.blocks;

  if (isEqual(newBlockData?.blocks, oldBlockData)) return;

  await syncAnnoteDocumentData();

  // Here we can reconcile any orphaned stickies
  await reconcileStickies();
}

async function reconcileStickies (): Promise<void> {
  // Take the current state of the document and current state of the stickies, use the sticky IDs to determine if there are any stickies that are not in the document

  // Create an array of stickyIds
  const currentStickyIds = stickies.value.map(sticky => sticky.sticky_id);

  // Convert the blocks data to an array of text data
  const blocksTextData = annoteDocument.value?.blocks.reduce((acc, block) => {
    if ("text" in block.data) {
      acc.push((block.data as AnyBlockType).text);
    }
  
    return acc;
  }, [] as string[]);
  
  const nonExistentStickyIds: string[] = [];
  currentStickyIds.forEach((stickyId) => {
    const stickyExists = blocksTextData?.some((blockText) => blockText.includes(stickyId));
    if (!stickyExists) {
      nonExistentStickyIds.push(stickyId);
    }
  });

  // Send API request to delete the stickies
  await Promise.allSettled(nonExistentStickyIds.map((stickyId) => handleDeleteSticky(stickyId)));
  
}

async function handleDeleteMarker(markerData: AnnotteOnMarkerDeletedData) {
  const { uuid } = markerData;
  const sticky_id = uuid;
  await useFetch<ApiResponse<Sticky>>(
    `/api/sticky/${sticky_id}`,
    {
      method: "DELETE",
    }
  );
 
  await syncAnnoteDocumentData();
  
  stickies.value = await fetchStickies(id as string);
}

async function syncAnnoteDocumentData () {
  annoteDocument.value = await patchAnnoteDocumentBlocks();
  annoteComparisonDocument.value = annoteDocument.value;
}

async function handleDeleteDocument () {
  if (!annoteDocument.value) {
    console.error("We can't delete this document. It's probably null.", annoteDocument.value);
    return;
  }
  
  const res = await deleteDocument(annoteDocument.value.document_id);

  if (res?.status === "ok") {
    toggleConfirmDeleteWindow();
    // When a document is successfully deleted, redirect to the user's library page
    await router.push(`/library`);
  } else {
    console.error("There was an error deleting the document", res);
  }
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