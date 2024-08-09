<template>
  <div class="flex gap-x-2">
    <div>
      <NuxtLink :to="linkUrl">
        <Icon name="mdi:pencil-outline" color="black" />
      </NuxtLink>
    </div>
    <div>
      <Icon name="mdi:share-variant-outline" color="black" />
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps<{
  linkUrl: string;
}>();
</script>
