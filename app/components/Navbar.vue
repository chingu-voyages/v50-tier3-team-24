<template>
  <nav class="relative p-4 text-black border-b-2 border-gray-100">
    <div class="container mx-auto">
      <div class="flex flex-wrap items-center justify-between">
        <div class="flex justify-between w-full lg:w-1/2">
          <NuxtLink to="/" class="flex items-center text-3xl no-underline">
            <img :src="documentIcon" alt="Icon" class="w-8 h-8 mr-2" />
            <p>Annote</p>
          </NuxtLink>

          <button class="lg:hidden" @click="toggleMenu">
            <span class="sr-only">Toggle menu</span>
            <img :src="hamburgerIcon" alt="Icon" class="w-8 h-8 mr-2" />
          </button>
        </div>

        <div class="items-center hidden space-x-6 lg:flex text-md">
          <ul class="flex flex-col lg:flex-row lg:space-y-0 lg:space-x-6">
            <li>
              <NuxtLink
                to="/about"
                class="flex items-center pt-4 no-underline lg:pt-0 homeBtnColor"
              >
                <img :src="homeIcon" alt="Icon" class="w-8 h-8 mr-2" />About
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/library"
                class="flex items-center pt-4 no-underline lg:pt-0 libraryBtnColor"
              >
                <img :src="bookIcon" alt="Icon" class="w-8 h-8 mr-2" />Library
              </NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/new"
                class="flex items-center pt-4 no-underline lg:pt-0 newBtnColor"
              >
                <img :src="addCircleIcon" alt="Icon" class="w-8 h-8 mr-2" />New
              </NuxtLink>
            </li>
            <li v-if="user" class="relative">
              <button
                @click="toggleDropdown"
                class="flex items-center pt-4 no-underline lg:pt-0 accountBtnColor"
              >
                <img :src="accountIcon" alt="Icon" class="w-8 h-8 mr-2" />
                Account
              </button>
              <div
                v-if="isDropdownOpen"
                class="absolute right-0 z-10 w-48 py-1 mt-2 bg-white rounded-md shadow-lg"
              >
                <p class="px-4 py-2 text-sm accountBtnColor">
                  {{ currentUser.username }}
                </p>
                <button
                  @click="handleLogout"
                  class="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            </li>
            <li v-else>
              <NuxtLink to="/login" class="flex items-center no-underline"
                >Sign In</NuxtLink
              >
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div
      v-if="isMenuOpen"
      class="absolute left-0 right-0 z-50 w-full bg-white shadow-md top-full"
    >
      <ul class="flex flex-col p-4 lg:flex-row lg:space-y-0 lg:space-x-6">
        <li>
          <NuxtLink
            to="/about"
            class="flex items-center pt-4 no-underline lg:pt-0 homeBtnColor"
            @click="isMenuOpen = false"
          >
            <img :src="homeIcon" alt="Icon" class="w-8 h-8 mr-2" />About
          </NuxtLink>
        </li>
        <li>
          <NuxtLink
            to="/library"
            class="flex items-center pt-4 no-underline lg:pt-0 libraryBtnColor"
            @click="isMenuOpen = false"
          >
            <img :src="bookIcon" alt="Icon" class="w-8 h-8 mr-2" />Library
          </NuxtLink>
        </li>
        <li>
          <NuxtLink
            to="/new"
            class="flex items-center pt-4 no-underline lg:pt-0 newBtnColor"
            @click="isMenuOpen = false"
          >
            <img :src="addCircleIcon" alt="Icon" class="w-8 h-8 mr-2" />New
          </NuxtLink>
        </li>
        <li v-if="user">
          <button
            @click="toggleDropdown"
            class="flex items-center pt-4 no-underline lg:pt-0 accountBtnColor"
          >
            <img :src="accountIcon" alt="Icon" class="w-8 h-8 mr-2" />
            Account
          </button>
        </li>
        <li v-else>
          <NuxtLink
            to="/login"
            class="flex items-center no-underline"
            @click="isMenuOpen = false"
            >Sign In</NuxtLink
          >
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import accountIcon from "@/public/assets/icons/account_circle.svg";
import addCircleIcon from "@/public/assets/icons/add_circle.svg";
import documentIcon from "@/public/assets/icons/edit_document.svg";
import hamburgerIcon from "@/public/assets/icons/hamburger.svg";
import homeIcon from "@/public/assets/icons/help_clinic.svg";
import bookIcon from "@/public/assets/icons/library_books.svg";
import { onMounted, onUnmounted, ref } from "vue";
import { useAuth } from "../composables/useAuth";

const user = useSupabaseUser();
const { logout, currentUser } = useAuth();
const isDropdownOpen = ref(false);
const isMenuOpen = ref(false);

const handleLogout = () => {
  logout();
};

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const toggleMenu = (event) => {
  event.stopPropagation();
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenuOnClickOutside = (event) => {
  if (isMenuOpen.value && !event.target.closest("nav")) {
    isMenuOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", closeMenuOnClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", closeMenuOnClickOutside);
});
</script>

<style scoped>
.homeBtnColor {
  color: #821eb1;
}
.libraryBtnColor {
  color: #e3b205;
}
.newBtnColor {
  color: #03a58d;
}
.accountBtnColor {
  color: #f1607d;
}
</style>
