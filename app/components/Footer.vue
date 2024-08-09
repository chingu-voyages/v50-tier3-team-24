<template>
  <footer class="py-8 text-white bg-gray-700">
    <div class="container px-4 mx-auto">
      <div class="flex flex-wrap items-center justify-between">
        <div class="w-full mb-4 md:w-1/4 md:mb-0">
          <NuxtLink to="/" class="flex items-center text-3xl no-underline">
            <img :src="documentIcon" alt="Icon" class="w-8 h-8 mr-2" />
            Annote
          </NuxtLink>
        </div>
        <p>
          © 2024 Annote App. This project is open source; find us on GitHub!
        </p>
        <div class="w-full mb-4 md:w-1/4 md:mb-0">
          <ul class="flex gap-4">
            <li>
              <NuxtLink to="/" class="hover:text-gray-900"
                >Terms of Service</NuxtLink
              >
            </li>
            <li>
              <NuxtLink to="/" class="hover:text-gray-900"
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
// Any necessary setup logic can go here
</script>
