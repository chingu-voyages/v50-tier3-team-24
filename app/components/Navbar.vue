<template>
  <nav class="p-4 text-black border-b-2 border-gray-100">
    <ul class="flex justify-between p-0 m-0 list-none">
      <li>
        <NuxtLink to="/" class="flex items-center text-3xl no-underline">
          <img :src="documentIcon" alt="Icon" class="w-8 h-8 mr-2" />
          Annote
        </NuxtLink>
      </li>

      <div class="flex items-center space-x-6 text-xl">
        <li>
          <NuxtLink
            to="/about"
            class="flex items-center no-underline homeBtnColor"
          >
            <img
              :src="homeIcon"
              alt="Icon"
              class="w-8 h-8 mr-2"
            />About</NuxtLink
          >
        </li>
        <li>
          <NuxtLink
            to="/library"
            class="flex items-center no-underline libraryBtnColor"
          >
            <img
              :src="bookIcon"
              alt="Icon"
              class="w-8 h-8 mr-2"
            />Library</NuxtLink
          >
        </li>
        <li>
          <NuxtLink
            to="/new"
            class="flex items-center no-underline newBtnColor"
          >
            <img
              :src="addCircleIcon"
              alt="Icon"
              class="w-8 h-8 mr-2"
            />New</NuxtLink
          >
        </li>

        <li v-if="user">
          <!-- <span v-if="currentUser"> Welcome, {{ currentUser.username }}! </span> -->

          <button
            @click="handleLogout"
            class="flex items-center no-underline accountBtnColor"
          >
            <img :src="accountIcon" alt="Icon" class="w-8 h-8 mr-2" />
            Logout
          </button>
        </li>
        <li v-else>
          <NuxtLink to="/login" class="flex items-center no-underline"
            >Sign In</NuxtLink
          >
        </li>
      </div>
    </ul>
  </nav>
</template>

<script setup>
import accountIcon from "@/public/assets/icons/account_circle.svg";
import addCircleIcon from "@/public/assets/icons/add_circle.svg";
import documentIcon from "@/public/assets/icons/edit_document.svg";
import homeIcon from "@/public/assets/icons/help_clinic.svg";
import bookIcon from "@/public/assets/icons/library_books.svg";
import { useAuth } from "../composables/useAuth";

const user = useSupabaseUser();
const { logout, currentUser } = useAuth();

const handleLogout = () => {
  logout();
};
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
