<template>
  <div class="flex flex-col min-h-screen">
    <Navbar />
    <main class="lg:flex-grow">
      <slot />
    </main>
    <Footer />
  </div>
</template>

<style scoped>
@media only screen and (min-width: 1024px) {
  main {
    margin-left: 20%;
    margin-right: 20%;
  }
}
</style>