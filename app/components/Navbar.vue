<template>
  <nav class="text-black p-4">
    <ul class="flex justify-between list-none m-0 p-0">
      <li>
        <NuxtLink to="/" class="no-underline font-gloria">Annote</NuxtLink>
      </li>

      <div class="flex space-x-4">
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
        <li>
          <NuxtLink to="/profile" class="no-underline font-gloria"
            >Profile</NuxtLink
          >
        </li>
      </div>
    </ul>
  </nav>
</template>

<script setup></script>
