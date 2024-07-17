<template>
  <nav class="text-black p-4">
    <ul class="flex justify-between list-none m-0 p-0">
      <li>
        <NuxtLink to="/" class="no-underline">Annote</NuxtLink>
      </li>

      <div class="flex space-x-4">
        <li>
          <NuxtLink to="/about" class="no-underline">About</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/library" class="no-underline">Library</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/new" class="no-underline">New</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/profile" class="no-underline">Profile</NuxtLink>
        </li>
      </div>
    </ul>
  </nav>
</template>

<script setup></script>
