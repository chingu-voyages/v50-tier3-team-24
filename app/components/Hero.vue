<template>
  <header class="relative px-4 py-20 text-center bg-gray-300">
    <div
      class="absolute inset-0 z-0 bg-center bg-cover"
      style="
        background-image: url('https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=3474&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
      "
    />
    <div class="relative z-10">
      <h1 class="mb-4 text-5xl font-bold text-white titleText">
        Welcome to Annote
      </h1>
      <p class="mb-8 text-2xl text-white titleText">
        Streamline your note-taking and boost productivity
      </p>
      <NuxtLink
        to="/new"
        class="px-6 py-3 font-bold text-white transition duration-300 bg-teal-500 rounded-lg hover:bg-teal-600"
        >Get Started</NuxtLink
      >
    </div>
  </header>
</template>

<style scoped>
.titleText {
  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000,
    1px 1px 0 #000;
}
</style>
