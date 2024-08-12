<script setup lang="ts">
import documentIcon from "@/public/assets/icons/edit_document.svg";
import newsIcon from "@/public/assets/icons/news.svg";
import visibilityIcon from "@/public/assets/icons/visibility.svg";

const annoteDocs = ref<AnnoteDocument[] | null>(null);
const stickyCountMap = ref<Record<string, number>>({});
const { getCurrentUser } = useAuth();

const currentUser = await getCurrentUser();

const currentPage = ref(1);
const documentsPerPage = 10;
const searchTerm = ref("");

onMounted(async () => {
  const { data: fetchedDocument } = await $fetch<ApiResponse<AnnoteDocument[]>>(
    "/api/annote_documents"
  );
  if (fetchedDocument) {
    annoteDocs.value = fetchedDocument;
  }

  if (annoteDocs.value) {
    stickyCountMap.value = await getStickiesCountForDocuments(annoteDocs.value);
  }
});

async function getStickiesCountForDocuments(
  annoteDocuments: AnnoteDocument[]
): Promise<Record<string, number>> {
  const res = await Promise.allSettled(
    annoteDocuments.map((doc) => fetchStickiesForDocument(doc.document_id))
  );

  return annoteDocuments.reduce((acc, doc) => {
    const foundResult = res.find(
      (r) =>
        r.status === "fulfilled" &&
        r.value.some((s) => s.document_id === doc.document_id)
    );
    if (foundResult && foundResult.status === "fulfilled") {
      acc[doc.document_id] = foundResult.value.length;
    } else {
      acc[doc.document_id] = 0;
    }
    return acc;
  }, {} as Record<string, number>);
}

async function fetchStickiesForDocument(documentId: string): Promise<Sticky[]> {
  const { data: fetchedStickies } = await $fetch<ApiResponse<Sticky[]>>(
    `/api/annote_documents/${documentId}/sticky`
  );
  return fetchedStickies || [];
}

const filteredDocs = computed(() => {
  if (!searchTerm.value) return annoteDocs.value;
  return annoteDocs.value?.filter((doc) =>
    doc.title.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

const paginatedDocs = computed(() => {
  const start = (currentPage.value - 1) * documentsPerPage;
  const end = start + documentsPerPage;
  return filteredDocs.value?.slice(start, end) || [];
});

const totalPages = computed(() => {
  return Math.ceil((filteredDocs.value?.length || 0) / documentsPerPage);
});

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
}
</script>

<template>
  <div
    class="flex flex-col items-center justify-between py-4 pr-4 md:flex-row gap-x-2"
  >
    <div
      class="flex flex-col items-center justify-between w-full gap-4 py-4 md:flex-row gap-x-2"
    >
      <div class="w-full">
        <button
          type="submit"
          class="p-2 text-white bg-[#03A58D] rounded font-cabin w-[107px] flex justify-center gap-2 w-full md:w-20"
        >
          <Icon
            name="mdi:plus-circle"
            class="self-center"
            :style="{ color: '#fafafa' }"
          />
          New
        </button>
      </div>
      <div class="flex w-full lightRoundedGreyBorder">
        <div class="self-center mt-2 ml-2">
          <Icon name="mdi:magnify" color="black" size="1.5rem" />
        </div>
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Search"
          class="w-full p-2 border border-black"
        />
      </div>

      <div class="w-full lightRoundedGreyBorder">
        <select class="w-full p-2">
          <option value="createdAscending">↑ Date Created Ascending</option>
          <option value="createdDescending">↓ Date Created Descending</option>
          <option value="alphaAscending">A↑ Alphabetical Ascending</option>
          <option value="alphaDescending">A↓ Alphabetical Descending</option>
        </select>
      </div>
    </div>
  </div>

  <ul>
    <li
      v-if="!filteredDocs || filteredDocs.length === 0"
      class="p-4 bg-gray-100"
    >
      <p v-if="!annoteDocs || annoteDocs.length === 0">
        Your library is empty. Click
        <NuxtLink to="/new" class="text-[#03a58d] hover:underline"
          >here</NuxtLink
        >
        to create a new document.
      </p>
      <p v-else>No documents match your search.</p>
    </li>

    <li
      v-else
      v-for="(doc, index) in paginatedDocs"
      :key="doc.document_id"
      :class="[
        'p-4 hover:custom-green duration-200 relative group',
        index % 2 === 0 ? 'bg-gray-100' : 'bg-white',
      ]"
    >
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <img :src="documentIcon" alt="Icon" class="w-6 h-6 mr-2" />
          <NuxtLink
            :to="`/${currentUser?.data?.username}/${doc.slug}?id=${doc.document_id}`"
          >
            <p class="text-xs sm:text-sm md:text-m truncatable-text">
              {{ doc.title }}
            </p>
          </NuxtLink>
        </div>
        <ShareLinkButtons
          :linkUrl="`/${currentUser?.data?.username}/${doc.slug}?id=${doc.document_id}`"
        />
      </div>
      <div
        class="absolute flex mt-2 mr-2 text-sm transition-opacity duration-500 opacity-0 top-2 right-20 group-hover:opacity-50"
      >
        <div class="flex items-center">
          <img :src="visibilityIcon" alt="Icon" class="w-4 h-4 mr-2" />
          <span class="mr-2 capitalize"> {{ doc.visibility }}</span>
        </div>
        <div class="flex items-center">
          <img :src="newsIcon" alt="Icon" class="w-4 h-4 mr-2" />
          <span>{{ stickyCountMap[doc.document_id] }} Stickies</span>
        </div>
      </div>
    </li>
  </ul>

  <div class="flex justify-end mt-4">
    <button
      v-if="currentPage > 1"
      @click="prevPage"
      class="px-4 py-2 mr-2 bg-gray-200 rounded hover:bg-gray-300"
    >
      Previous
    </button>
    <button
      v-for="page in totalPages"
      :key="page"
      @click="currentPage = page"
      :class="[
        'px-4 py-2 mx-1 rounded',
        currentPage === page
          ? 'bg-[#03a58d] text-white'
          : 'bg-gray-200 hover:bg-gray-300',
      ]"
    >
      {{ page }}
    </button>
    <button
      @click="nextPage"
      :disabled="currentPage === totalPages"
      :class="[
        'px-4 py-2 ml-2 rounded',
        currentPage === totalPages
          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
          : 'bg-gray-200 hover:bg-gray-300',
      ]"
    >
      Next
    </button>
  </div>
</template>

<style scoped>
.truncatable-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 280px;
}

.lightRoundedGreyBorder {
  border: 1px solid #dddddd;
  border-radius: 5px;
}

input {
  outline: none;
  border: none;
}

select {
  outline: none;
  border: none;
}

.hover\:custom-green:hover {
  color: #03a58d;
}

@media only screen and (min-width: 768px) {
  .truncatable-text {
    max-width: 600px;
  }
}
</style>
