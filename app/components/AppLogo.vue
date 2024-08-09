<template>
  <div>
    <NuxtLink to="/" class="flex items-center text-3xl no-underline">
      <slot>
        <!-- The default content is the colored logo -->
        <img :src="documentIcon" alt="Icon" class="w-8 h-8 mr-2" />
       </slot>
       <p class="text-4xl lg:block hidden">
         Annote
       </p>
    </NuxtLink>
    
  </div>
</template>
<script setup lang="ts">
import documentIcon from "@/public/assets/icons/edit_document.svg";
</script>