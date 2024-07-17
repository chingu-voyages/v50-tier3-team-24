<template>
  <div>
    <Navbar />
    <main class="p-5">
      <slot />
    </main>
  </div>
</template>

<script setup>
import Navbar from "../components/Navbar.vue";
</script>
