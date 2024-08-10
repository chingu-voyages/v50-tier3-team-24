<script setup lang="ts">
import documentIcon from "@/public/assets/icons/edit_document.svg";
import newsIcon from "@/public/assets/icons/news.svg";
import visibilityIcon from "@/public/assets/icons/visibility.svg";

const annoteDocs = ref<AnnoteDocument[] | null>(null);
const { getCurrentUser } = useAuth();

const currentUser = await getCurrentUser();

onMounted(async () => {
  const { data: fetchedDocument } = await $fetch<ApiResponse<AnnoteDocument[]>>(
    "/api/annote_documents"
  );
  if (fetchedDocument) {
    annoteDocs.value = fetchedDocument;
  }
});
</script>

<template>
  <div class="w-2/3 mx-auto mt-4">
    <h1 class="text-2xl">Library</h1>
    <!-- This search bar section -->
    <div class="flex justify-end py-4 pr-4 gap-x-2">
      <div class="flex searchTextField lightRoundedGreyBorder">
        <div class="self-center mt-2 ml-2">
          <Icon name="mdi:magnify" color="black" size="1.5rem" />
        </div>
        <input
          type="text"
          placeholder="Search"
          class="w-full p-2 border border-black searchInput"
        />
      </div>

      <!-- Drop down search filter -->
      <div class="content-center lightRoundedGreyBorder">
        <select>
          <option value="createdAscending">
            <p>&#129031; Date Created Ascending</p>
          </option>
          <option value="createdDescending">
            &#129029; Date Created Descending
          </option>
          <option value="alphaAscending">
            &#129031; Alphabetical Ascending
          </option>
          <option value="alphaDescending">
            &#129029; Alphabetical Descending
          </option>
        </select>
      </div>
    </div>

    <!-- This is the list of annote documents -->
    <ul>
      <li
        v-for="(doc, index) in annoteDocs"
        :key="doc.document_id"
        :class="[
          'p-4 hover:custom-green duration-200 relative group',
          index % 2 === 0 ? 'bg-gray-100' : 'bg-white',
        ]"
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <img :src="documentIcon" alt="Icon" class="w-6 h-6 mr-2" />
            <p>
              {{ doc.title }}
              {{ console.log(doc) }}
            </p>
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
            <span>Stickies</span>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.truncatable-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: calc(100vw - 80px);
}

.searchTextField {
  max-width: 240px;
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
</style>
