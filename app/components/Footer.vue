<template>
  <footer class="py-8 text-white bg-gray-700 w-full bottom-0 z-50">
    <div class="container px-4 mx-auto">
      <div class="flex items-center justify-between md:flex-row">
        <div class="w-full mb-4 md:w-1/4 md:mb-0 flex justify-center lg:flex-none">
          <NuxtLink to="/" class="flex items-center !text-md lg:text-3xl no-underline">
            <img :src="documentIcon" alt="Icon" class="w-8 h-8 mr-2" />
            Annote
          </NuxtLink>
        </div>
        <p class="text-sm md:text-left md:mb-0 self-center">
          © 2024 Annote App. This project is open source; find us on
          <NuxtLink to="https://github.com/chingu-voyages/v50-tier3-team-24" target="_blank" >
            <Icon name="mdi:github" size="1.3rem" />
          </NuxtLink>
        </p>
        <div class="w-full md:w-1/4">
          <ul
            class="flex flex-col items-center gap-4 md:flex-row md:justify-end"
          >
            <li>
              <NuxtLink
                to="/"
                class="transition-colors duration-200 hover:text-gray-300 text-sm"
                >Terms of Service</NuxtLink
              >
            </li>
            <li>
              <NuxtLink
                to="/"
                class="transition-colors duration-200 hover:text-gray-300 text-sm"
                >Privacy Policy</NuxtLink
              >
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
