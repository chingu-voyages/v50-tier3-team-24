<template>
  <div>
    <div class="flex bg-gray-100 border border-gray-300 rounded p-5 min-h-[300px] my-5">
      <div>
        <header>
          <!-- Document Titles -->
          <div class="flex gap-2 p-4 bg-white">
            <h1 class="text-2xl font-semibold font-verdana">
              {{ annoteDocument?.title }}
            </h1>

            <div class="pt-2">
              <ShareLinkButtons v-if="currentUser?.user_id === annoteDocument?.user_id"
                :link-url="`${annoteDocument?.slug}/edit?id=${annoteDocument?.document_id}`">
                <button @click="toggleConfirmDeleteWindow">
                  <!-- This is the document delete button. -->
                  <Icon name="mdi:trash-can-outline" class="text-gray-300 hover:text-[#F64C00]" />
                </button>
              </ShareLinkButtons>
              <ConfirmationModal prompt="Are you sure you want to delete this document?" :open="confirmDeleteWindowOpen"
                :onClose="toggleConfirmDeleteWindow" :onConfirmAction="handleDeleteDocument"
                :confirmActionLabel="'Delete'" />
            </div>
          </div>
          <div v-if="annoteDocument?.visibility === 'public'" class="pl-4 flex gap-[2px] bg-white">
            <Icon name="mdi:share-variant-outline mt-[3px]" :style="{ color: '#75D3D4' }" />
            <p class="text-teal-500 text-base mb-2">Public</p>
          </div>
          <!-- Document Link -->
          <NuxtLink :to="annoteDocument?.source_url" target="_blank">
            <div class="flex gap-2 pl-4 pr-4 bg-white">
              <Icon name="mdi:arrow-top-right-thin-circle-outline" style="color: #787878" size="20px" />
              <p class="font-verdana greyLinkColor">
                {{ annoteDocument?.source_url }}
              </p>
            </div>
          </NuxtLink>
        </header>
        <div v-if="isBusy" class="flex justify-center h-14">
          <VueSpinner color="#03a58d" size="30px" />
        </div>
        <div v-else>
          <ClientOnly>
            <EditorComponent :onEditorReady="handleEditorReady" :readOnly="true" />
          </ClientOnly>
        </div>
      </div>
      <div>
        <div class="flex flex-wrap bg-white lg:fixed">
          <TransitionGroup>
            <StickyNote :readonly="true" v-for="sticky in stickiesInView" :key="sticky.sticky_id" :stickyData="sticky"
              :pinNumber="sticky.anchor" :documentId="sticky.document_id" :uuid="sticky.sticky_id" :color="sticky.color"
              :author="sticky.author" />
          </TransitionGroup>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { VueSpinner } from 'vue3-spinners';
import { ANNOTE_MARKER_CSS } from '~/types/annote-document/annote-document';
const route = useRoute();
const annoteDocument = ref<AnnoteDocument | null>(null);
const editorController = ref<CustomEditorJs | null>(null);
const stickies = ref<Sticky[]>([]); // These will be readonly stickies

const stickiesInView = ref<Sticky[]>([]); // These will be stickies in view port
const router = useRouter();
const { fetchStickies } = useSticky();
const { deleteDocument, isMarkerInViewPort } = useDocument();
const { getCurrentUser } = useAuth();

const currentUser = (await getCurrentUser())?.data;
const confirmDeleteWindowOpen = ref(false);

const { id } = route.query;
const isBusy = ref(false);

onMounted(() => {
  window.addEventListener("scroll", handleWindowScroll);

  // This is hacky - but we need to wait for DOM to be ready before we can check for markers in viewport on initial load

  setTimeout(() => {
    handleWindowScroll();
  }, 100);

});

if (id) {
  const { data: apiResponse } = await useFetch<ApiResponse<AnnoteDocument>>(
    `/api/annote_documents/${id}`
  );

  if (apiResponse.value?.status !== "ok") {
    await navigateTo("/forbidden");
  }
  annoteDocument.value = apiResponse.value?.data!;

  stickies.value = await fetchStickies(id as string);
  useHead({ title: `${annoteDocument.value?.title} | Annote` });
}

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

function handleEditorReady(editor: CustomEditorJs) {
  editor.isReady.then(() => {
    editorController.value = editor;
    editorController.value.render({
      blocks: annoteDocument.value?.blocks || [],
    });
  });
}

function toggleConfirmDeleteWindow() {
  confirmDeleteWindowOpen.value = !confirmDeleteWindowOpen.value;
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
    console.error("Failed to delete document", res);
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
