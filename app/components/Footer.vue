<template>
  <footer class="app-footer app-theme-transition bottom-0 z-50 w-full py-8">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between md:flex-row">
        <div class="mb-4 flex w-full justify-center md:mb-0 md:w-1/4 lg:flex-none">
          <NuxtLink to="/" class="flex items-center !text-md no-underline lg:text-3xl">
            <img :src="documentIcon" alt="Icon" class="mr-2 h-8 w-8" />
            Annote
          </NuxtLink>
        </div>
        <p class="self-center text-sm md:mb-0 md:text-left">
          © 2024 Annote App. This project is open source; find us on
          <NuxtLink to="https://github.com/chingu-voyages/v50-tier3-team-24" target="_blank">
            <Icon name="mdi:github" size="1.3rem" />
          </NuxtLink>
        </p>
        <div class="w-full md:w-1/4">
          <ul class="flex flex-col items-center gap-4 md:flex-row md:justify-end">
            <li>
              <NuxtLink to="/" class="text-sm transition-colors duration-200 hover:text-gray-300">Terms of Service
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/" class="text-sm transition-colors duration-200 hover:text-gray-300">Privacy Policy
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import documentIcon from "@/public/assets/icons/edit_document.svg";
</script>
