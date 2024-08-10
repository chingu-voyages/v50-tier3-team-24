<template>
  <div class="flex flex-col min-h-screen">
    <Navbar />
    <main class="flex-grow p-5">
      <slot />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import Footer from "../components/Footer.vue";
import Navbar from "../components/Navbar.vue";
</script>
