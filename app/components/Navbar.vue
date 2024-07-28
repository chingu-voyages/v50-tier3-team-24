<template>
  <nav class="p-4 text-black border-b-2 border-gray-100">
    <ul class="flex justify-between p-0 m-0 list-none">
      <li>
        <NuxtLink to="/" class="text-3xl no-underline font-gloria">
          📝 Annote
        </NuxtLink>
      </li>

      <div class="flex items-center space-x-6 text-xl">
        <li>
          <NuxtLink to="/about" class="no-underline font-gloria"
            >About</NuxtLink
          >
        </li>
        <li>
          <NuxtLink to="/library" class="no-underline font-gloria"
            >Library</NuxtLink
          >
        </li>
        <li>
          <NuxtLink to="/new" class="no-underline font-gloria">New</NuxtLink>
        </li>

        <li v-if="user">
          <span v-if="currentUser">
            Welcome, {{ currentUser.username }}!
          </span>
          <button @click="handleLogout" class="no-underline font-gloria">
            Logout
          </button>
        </li>
        <li v-else>
          <NuxtLink to="/login" class="no-underline font-gloria"
            >Sign In</NuxtLink
          >
        </li>
      </div>
    </ul>
  </nav>
</template>

<script setup>
import { useAuth } from "../composables/useAuth";

const user = useSupabaseUser();
const { logout, currentUser } = useAuth();

const handleLogout = () => {
  logout();
};
</script>
