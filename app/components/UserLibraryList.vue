<script setup lang="ts">
  const { data: annoteDocs } = await useFetch<ApiResponse<AnnoteDocument[]>>('/api/annote_documents');
</script>

<template>
  <div class="mt-4">
    <!-- This search bar section -->
    <div class="py-4 flex justify-end">

      <div class="searchTextField flex">
        <div class="self-center">
          <Icon name="mdi:magnify" color="black" size="1.5rem" />
        </div>
        <input type="text" placeholder="Search" class="searchInput w-full p-2 border border-black" />
      </div>

      <!-- Drop down search filter -->
      <div>
        <select>
          <option value="createdAscending">Date Created Ascending</option>
          <option value="createdDescending">Date Created Descending</option>
          <option value="alphaAscending">Alphabetical Ascending</option>
          <option value="alphaDescending">Alphabetical Descending</option>
        </select>
      </div>
    </div>
    <ul>
      <li class="border-t border-black pt-2 pb-2 pl-2" v-for="doc in annoteDocs?.data" :key="doc.document_id">
        <div class="flex justify-between">
          <div>
            <p class="truncatable-text">
              {{ doc.title }}
            </p>
          </div>
          <div class="flex gap-x-2 pr-4">
            <div>
              <Icon name="mdi:pencil-outline" color="black" />
            </div>
            <div>
              <Icon name="mdi:share-variant-outline" color="black" />

            </div>
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
    width: calc(100vw - 60px);
  }

  .searchTextField {
    max-width: 240px;
    border: 1px solid #DDDDDD;
    border-radius: 5px;
  }

  input {
    outline: none;
    border: none;
  }

</style>