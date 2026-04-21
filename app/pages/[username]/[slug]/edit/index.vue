<template>
  <div>
    <div class="flex">
      <input type="text" v-model="documentTitle" @blur="handleDocumentTitleBlur" :disabled="isReadOnly"
        class="w-full p-2 border border-gray-300 rounded font-verdana" placeholder="Title" />
      <div class="flex items-center gap-2 ml-2">
        <button class="hover:custom-green" :disabled="isReadOnly">
          <Icon name="mdi:check" />
        </button>
        <button class="hover:text-[#F64C00]" @click="toggleConfirmDeleteWindow" :disabled="isReadOnly">
          <Icon name="mdi:trash-can-outline" />
        </button>
      </div>
    </div>
    <!-- visibility setting -->
    <div class="my-2 flex">
      <VueSpinner v-if="isBusy" size="20" color="#03a58d" />
      <input id="visibility" type="checkbox" v-model="isVisible" :disabled="isBusy || isReadOnly"
        v-on:change="handleUpdateVisibility" />
      <label for="visibility" class="text-base ml-2">Public</label>
    </div>
    <div class="flex  border border-gray-300 rounded p-5 min-h-[300px] my-5">
      <ClientOnly>
        <div class="min-w-[50%]">
          <EditorComponent :onEditorReady="handleEditorReady" :onMarkerInserted="handleMarkerInserted"
            :onMarkerDeleted="handleDeleteMarker" :onLostFocus="handleEditorLostFocus" :readOnly="isReadOnly" />
        </div>
      </ClientOnly>
      <div class="editor-container">
        <Transition>
          <div v-if="isInsertingNewAnnotation" id="new-sticky-container" class="p-2 fixed">
            <!-- This is for new annotation stickes -->
            <StickyNote :isNew="isInsertingNewAnnotation" :color="newStickyData?.color!"
              :pinNumber="newStickyData?.pinNumber!" :documentId="newStickyData?.documentId!"
              :author="newStickyData?.author" :title="newStickyData?.title" :onUpdateCreate="handleUpdateCreateSticky"
              :onCancel="handleCloseOutSticky" :uuid="newStickyData?.uuid" />
          </div>
        </Transition>
        <div class="flex flex-wrap fixed" v-if="!isInsertingNewAnnotation">
          <!-- This is rendering the existing stickies in readonly mode, but can be edited if they click the menu option -->
          <TransitionGroup>
            <StickyNote v-for="sticky in stickiesInView" :key="sticky.sticky_id" :stickyData="sticky"
              :author="sticky.author" :color="sticky.color" :pinNumber="sticky.anchor" :documentId="sticky.document_id"
              :readonly="true" :uuid="sticky.sticky_id" :canEdit="isReadOnly === false"
              :onUpdateCreate="handleUpdateCreateSticky" />
          </TransitionGroup>
        </div>
      </div>
    </div>
    <ConfirmationModal prompt="Are you sure you want to delete this document?" :open="confirmDeleteWindowOpen"
      :onClose="toggleConfirmDeleteWindow" :onConfirmAction="handleDeleteDocument" />
    <div>
      <!-- This is a place to show errors -->
      <p v-if="isApiError" class="text-red-500">An error occurred while processing your request.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { isEmpty, isEqual } from 'lodash';
import { VueSpinner } from 'vue3-spinners';
import { BlockAnnoteMarkerReconciler } from '~/app/utils/block-annote-marker-reconciler/block-annote-marker-reconciler';
import type { EditorJsBlock } from '~/types/annote-document/editjs-block';
import type { ActionType } from '~/types/sticky/action-type/action-type';
import type { StickyCreateActionData, StickyUpdateActionData } from '~/types/sticky/sticky-action-data/sticky-action-data';
import type { LinkSticky, Sticky, VideoSticky } from '~/types/sticky/sticky-types';
import type { AnnoteOnMarkerInsertedData, AnnotteOnMarkerDeletedData } from '../../../../utils/annote-marker/definitions/types';

const route = useRoute();
const { deleteDocument, isMarkerInViewPort } = useDocument();
const { fetchStickies } = useSticky();
const { getCurrentUser } = useAuth();

const currentUser = (await getCurrentUser())?.data;
const isReadOnly = ref(true);

const router = useRouter();

const annoteDocument = ref<AnnoteDocument | null>(null);
// The comparison document is going to be used to determine if there are changes in the document
const annoteComparisonDocument = ref<AnnoteDocument | null>(null);

const documentTitle = ref("");
const editorController = ref<CustomEditorJs | null>(null);

const isVisible = ref<boolean>(false);

const initialDocumentTitle = ref(""); // The original title when the document loads. This will not change.

const isInsertingNewAnnotation = ref(false);
const newStickyData = ref<{ pinNumber: number; color: string; title: string, documentId: string, uuid: string, author: string } | null>(null);

const stickies = ref<Sticky[]>([]);
const stickiesInView = ref<Sticky[]>([]);
const isBusy = ref<boolean>(false);
const isApiError = ref<boolean>(false);

const confirmDeleteWindowOpen = ref(false);

const { id } = route.query;

onMounted(() => {
  window.addEventListener("scroll", handleWindowScroll);

  // This is hacky - but we need to wait for DOM to be ready before we can check for markers in viewport on initial load

  setTimeout(() => {
    handleWindowScroll();
  }, 100);

});

function handleWindowScroll() {
  const markers = document.getElementsByClassName(ANNOTE_MARKER_CSS);
  const uuidsInViewPort: string[] = [];

  for (let i = 0; i < markers.length; i++) {
    if (markers[i] && isMarkerInViewPort(markers[i] as HTMLElement)) {
      uuidsInViewPort.push((markers[i] as any)?.dataset.uuid);
    }
  }

  stickiesInView.value = stickies.value.filter((sticky) => uuidsInViewPort.includes(sticky.sticky_id));
}

async function handleDocumentTitleBlur() {
  // This function handles when the user clicks out of the title input field
  // It should send a patch request to the server to update the document title
  // The documentTitleField can't be empty. If it is, how do we handle the error?
  // TODO: Handle the error when the document title is empty

  if (documentTitle.value === initialDocumentTitle.value) return;
  if (documentTitle.value.trim() === "") {
    documentTitle.value = initialDocumentTitle.value;
    isApiError.value = true;
    return;
  }

  try {
    isApiError.value = false;
    const { data: apiResponse } = await $fetch<ApiResponse<AnnoteDocument>>(
      `/api/annote_documents/${id}`,
      {
        method: "PATCH",
        body: { title: documentTitle.value },
      }
    );

    const { slug, document_id } = apiResponse as AnnoteDocument;

    await navigateTo({
      path: `/library/${slug}/edit`,
      query: {
        id: document_id,
      },
    });

  } catch (error) {
    console.error("An error occurred while updating the document title", error);
    documentTitle.value = initialDocumentTitle.value;
    isApiError.value = true;
  }
}

async function patchAnnoteDocumentBlocks(): Promise<AnnoteDocument | undefined> {
  const snapshot = await editorController.value?.save();

  // Reconcile the blocks to ensure that the pin numbers are in order
  const blockData = new BlockAnnoteMarkerReconciler().reconcile(snapshot?.blocks as EditorJsBlock[]);

  try {
    const { data: apiResponse } = await $fetch<ApiResponse<AnnoteDocument>>(
      `/api/annote_documents/${id}`,
      {
        method: "PATCH",
        body: { blocks: blockData?.blocks },
      }
    );

    return apiResponse as AnnoteDocument;

  } catch (error) {
    console.error("An error occurred while updating the document blocks", error);
    isApiError.value = true;
  }
}

if (id) {
  isBusy.value = true;
  isApiError.value = false;
  try {
    const { data: apiResponse } = await $fetch<ApiResponse<AnnoteDocument>>(
      `/api/annote_documents/${id}`
    );
    const { user_id, title, visibility } = apiResponse as AnnoteDocument;
    if (currentUser?.user_id === user_id) {
      isReadOnly.value = false;
    }

    annoteDocument.value = apiResponse as AnnoteDocument;
    annoteComparisonDocument.value = apiResponse as AnnoteDocument;
    initialDocumentTitle.value = title;
    documentTitle.value = title;

    isVisible.value = visibility === "public";
    useHead({ title: `Edit - ${title} | Annote` });
    stickies.value = await fetchStickies(id as string);

  } catch (error) {
    console.error("An error occurred while fetching the document data", error);
    isApiError.value = true;
  } finally {
    isBusy.value = false;

  }
}

function handleMarkerInserted(data?: AnnoteOnMarkerInsertedData) {
  if (!data) {
    console.warn("No data was returned. Aborting");
    return;
  }
  isInsertingNewAnnotation.value = true;
  const { pinNumber, color, text, uuid } = data!;
  newStickyData.value = { pinNumber, color, title: text || "", documentId: annoteDocument.value?.document_id!, uuid, author: currentUser?.username! };
}

function handleEditorReady(editor: CustomEditorJs) {
  editorController.value = editor;
  editor.isReady.then(() => {
    editor.render({
      blocks: annoteDocument.value?.blocks as any,
    });
  });
}

async function handleUpdateVisibility(e: Event) {
  const visibility = isVisible.value ? "public" : "private";

  setTimeout(async () => {

    try {
      const { data: apiResponse } = await $fetch<ApiResponse<AnnoteDocument>>(
        `/api/annote_documents/${id}`,
        {
          method: "PATCH",
          body: { visibility },
        }
      );
      annoteDocument.value = apiResponse as AnnoteDocument;
      isVisible.value = annoteDocument.value.visibility === "public";
      isBusy.value = false;

    } catch (error) {
      console.error("An error occurred while updating the document visibility", error);
      isVisible.value = !isVisible.value; // Revert the toggle
      isApiError.value = true;
    }
  }, 1000);
}

async function handleUpdateCreateSticky(
  action: ActionType,
  values: StickyCreateActionData | StickyUpdateActionData): Promise<void> {
  const { sticky_id } = (values as StickyCreateActionData);
  const {
    document_id,
    title,
    body,
    anchor,
    color,
    sticky_type,
    author,
    source_url } = values;

  const requestBody = { document_id, title, body, color, anchor, sticky_type, sticky_id, source_url, author };
  const endPoint = action === "create" ? "/api/sticky" : `/api/sticky/${sticky_id}`;

  try {
    await $fetch<ApiResponse<Sticky | VideoSticky | LinkSticky>>(
      endPoint,
      {
        method: action === "create" ? "POST" : "PATCH",
        body: requestBody
      }
    );

    await syncAnnoteDocumentData();

    stickies.value = await fetchStickies(id as string);
    isInsertingNewAnnotation.value = false;
    newStickyData.value = null;

    // We need to focus on the sticky if it's in view.

    handleWindowScroll();

  } catch (error) {
    console.error(`An error occurred while ${action === "create" ? "creating" : "updating"} the sticky`, error);
    isApiError.value = true;
  }
}

async function handleCloseOutSticky() {
  isInsertingNewAnnotation.value = false;
  newStickyData.value = null;

  // This should re-render the editor to the last fetched-from-API state, undoing the new marker. TODO: It's hacky
  await editorController.value?.render({
    blocks: annoteDocument.value?.blocks as any,
  })
}

function toggleConfirmDeleteWindow() {
  confirmDeleteWindowOpen.value = !confirmDeleteWindowOpen.value;
}

async function handleEditorLostFocus() {
  if (isReadOnly.value) {
    console.info("Editor is readonly mode.");
    return;
  }
  // This function handles the click away event from the editor and sends the patch request to
  const newBlockData = await editorController.value?.save();
  const oldBlockData = annoteComparisonDocument.value?.blocks;

  if (isEqual(newBlockData?.blocks, oldBlockData)) return;
  if (isInsertingNewAnnotation.value) return;

  await syncAnnoteDocumentData();
}

async function handleDeleteMarker(markerData: AnnotteOnMarkerDeletedData) {
  const { uuid } = markerData;
  const sticky_id = uuid;
  await $fetch<ApiResponse<Sticky>>(
    `/api/sticky/${sticky_id}`,
    {
      method: "DELETE",
    }
  );

  await syncAnnoteDocumentData();

  stickies.value = await fetchStickies(id as string);

  handleWindowScroll();
}

async function syncAnnoteDocumentData() {
  annoteDocument.value = await patchAnnoteDocumentBlocks();
  annoteComparisonDocument.value = annoteDocument.value;

  await updateStickyMarkerNumbers(new BlockAnnoteMarkerReconciler()
    .reconcile(annoteDocument.value?.blocks as EditorJsBlock[])
    .map
  );
  stickies.value = await fetchStickies(id as string);

  // Reconcile and sync-up
  await editorController.value?.render({
    blocks: annoteDocument.value?.blocks as any,
  });
}

async function updateStickyMarkerNumbers(data: Record<string, number>): Promise<void> {
  // Creates and sends request to update the sticky numbers by id in the database
  if (isEmpty(data)) return;
  const promises = Object.entries(data).map(([stickyId, pinNumber]) => {
    return $fetch<ApiResponse<Sticky>>(
      `/api/sticky/${stickyId}`,
      {
        method: "PATCH",
        body: { anchor: pinNumber, document_id: id },
      }
    );
  });
  await Promise.allSettled(promises);
}

async function handleDeleteDocument() {
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

.editor-container {
  width: --webkit-fill-available;
  min-width: 70vw;
}
</style>