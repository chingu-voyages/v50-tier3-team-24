<script setup lang="ts">
  const annoteDocs = ref<AnnoteDocument[] | null>(null);

  onMounted(async () => {
    const { data: fetchedDocument } = await $fetch<ApiResponse<AnnoteDocument[]>>('/api/annote_documents');
    if (fetchedDocument) {
      annoteDocs.value = fetchedDocument;
    }
   
  });
</script>

<template>
  <div class="mt-4">
    <!-- This search bar section -->
    <div class="py-4 flex justify-end gap-x-2 pr-4">

      <div class="searchTextField lightRoundedGreyBorder flex">
        <div class="self-center mt-2">
          <Icon name="mdi:magnify" color="black" size="1.5rem" />
        </div>
        <input type="text" placeholder="Search" class="searchInput w-full p-2 border border-black" />
      </div>

      <!-- Drop down search filter -->
      <div class="lightRoundedGreyBorder content-center">
        <select>
          <option value="createdAscending">
            <p>&#129031; Date Created Ascending</p>
          </option>
          <option value="createdDescending">&#129029; Date Created Descending</option>
          <option value="alphaAscending">&#129031; Alphabetical Ascending</option>
          <option value="alphaDescending">&#129029; Alphabetical Descending</option>
        </select>
      </div>
    </div>
    <ul>
      <li class="border-t border-black pt-2 pb-2 pl-2" v-for="doc in annoteDocs" :key="doc.document_id">
        <div class="flex justify-between">
          <div>
            <p class="truncatable-text">
              {{ doc.title }}
            </p>
          </div>
          <ShareLinkButtons :linkUrl="`/fake-user/${doc.slug}?id=${doc.document_id}`" />
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
    border: 1px solid #DDDDDD;
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
</style>
