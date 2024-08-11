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

        <div
          :class="[
            'lg:flex',
            { hidden: !isMenuOpen },
            'items-center space-x-6 text-md',
            'absolute top-full left-0 w-full bg-white p-4 z-50 lg:relative lg:w-auto',
          ]"
        >
          <ul class="flex flex-col lg:flex-row lg:space-y-0 lg:space-x-6">
            <li v-for="item in menuItems" :key="item.to">
              <NuxtLink
                :to="item.to"
                class="flex items-center pt-4 no-underline lg:pt-0"
                :class="item.class"
                @click="isMenuOpen = false"
              >
                <img :src="item.icon" alt="Icon" class="w-8 h-8 mr-2" />{{
                  item.text
                }}
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
                class="z-10 w-48 mt-4 bg-white lg:rounded-md lg:shadow-lg lg:absolute"
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
              <NuxtLink
                to="/login"
                class="flex items-center no-underline"
                @click="isMenuOpen = false"
                >Sign In</NuxtLink
              >
            </li>
          </ul>
        </div>
      </div>
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

const menuItems = [
  { to: "/about", icon: homeIcon, text: "About", class: "homeBtnColor" },
  { to: "/library", icon: bookIcon, text: "Library", class: "libraryBtnColor" },
  { to: "/new", icon: addCircleIcon, text: "New", class: "newBtnColor" },
];

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

@media (max-width: 1023px) {
  .absolute {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
      0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }
}
</style>
