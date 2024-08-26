<script setup lang="ts">
import { VueSpinner } from 'vue3-spinners';
useHead({ 
  title: "Library | Annote",
})
</script>

<template>
  <div>
    <div class="mt-4 libraryContainer">
      <h1 class="text-2xl">Library</h1>
      <Suspense>
        <UserLibraryList />
        <template #fallback>
          <div class="flex justify-center h-14">
            <VueSpinner size="30" color="#03A58D" />
          </div>
        </template>
      </Suspense>
    </div>
  </div>
</template>

<style scoped>
.libraryContainer {
  max-width: 960px;
}
</style>
