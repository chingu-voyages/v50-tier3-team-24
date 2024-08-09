<template>
  <footer class="bg-gray-800 text-white p-5 absolute bottom-0 w-full flex justify-between">
    <div class="self-center">
      <AppLogo>
        <img :src="greyLibraryIcon" alt="Icon" class="w-8 h-8 mr-2" />
      </AppLogo>
    </div>
    <div class="flex justify-between gap-x-5">
      <p class="text-base self-center">
        © 2024 Annote App.
      </p>
      <div class="flex flex-col lg:flex-row lg:justify-end lg:gap-x-5  lg:items-center">
        <p class="hidden lg:block">
          This project is open source; find us on <NuxtLink to="https://github.com/chingu-voyages/v50-tier3-team-24">
            GitHub!
          </NuxtLink> 
        </p>
        <div class="block lg:hidden">
          <NuxtLink to="https://github.com/chingu-voyages/v50-tier3-team-24">
            <Icon name="mdi:github" size="2em" />
          </NuxtLink>
        </div>
        <p class="text-base">
          Terms of Service
        </p>
        <p class="text-base">
          Privacy Policy
        </p>
      </div>
    </div>
  </footer>
</template>
<script lang="ts" setup>
import greyLibraryIcon from "@/public/assets/icons/library_grey.svg";

</script>