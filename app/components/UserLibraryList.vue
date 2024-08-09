<script setup lang="ts">
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
  <div class="mt-4">
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
          'pt-2 pb-2 pl-2 hover:custom-green duration-200',
          index % 2 === 0 ? 'bg-gray-100' : 'bg-white',
        ]"
      >
        <div class="flex justify-end">
          <div>
            <p class="truncatable-text">
              {{ doc.title }}
            </p>
          </div>
          <ShareLinkButtons
            :linkUrl="`/${currentUser?.data?.username}/${doc.slug}?id=${doc.document_id}`"
          />
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
