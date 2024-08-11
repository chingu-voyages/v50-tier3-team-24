<template>
  <footer class="py-8 text-white bg-gray-700 w-full sticky bottom-0 z-50">
    <div class="container px-4 mx-auto">
      <div class="flex flex-col items-center justify-between md:flex-row">
        <div class="w-full mb-4 md:w-1/4 md:mb-0">
          <NuxtLink to="/" class="flex items-center text-3xl no-underline">
            <img :src="documentIcon" alt="Icon" class="w-8 h-8 mr-2" />
            Annote
          </NuxtLink>
        </div>
        <p class="mb-4 text-center md:text-left md:mb-0">
          © 2024 Annote App. This project is open source; find us on GitHub!
        </p>
        <div class="w-full md:w-1/4">
          <ul
            class="flex flex-col items-center gap-4 md:flex-row md:justify-end"
          >
            <li>
              <NuxtLink
                to="/"
                class="transition-colors duration-200 hover:text-gray-300"
                >Terms of Service</NuxtLink
              >
            </li>
            <li>
              <NuxtLink
                to="/"
                class="transition-colors duration-200 hover:text-gray-300"
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
