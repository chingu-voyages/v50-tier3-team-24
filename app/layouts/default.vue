<template>
  <div>
    <Navbar />
    <main class="p-5">
      <slot />
    </main>
    <Footerbar />
  </div>
</template>

<script setup>
import Footerbar from "../components/Footerbar.vue";
import Navbar from "../components/Navbar.vue";
</script>
