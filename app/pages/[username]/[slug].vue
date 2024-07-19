<script setup lang="ts">
  // This is just placeholder - but we have access to the route path
  // For now this page just displays the route path
  const route = useRoute();
  console.log(route.path)
</script>
<template>
  <h1 class="font-bold text-2xl">Document page</h1>
  <p>{{ route.path }}</p>
</template>