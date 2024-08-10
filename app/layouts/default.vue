<template>
  <div>
    <Navbar />
    <main class="p-5">
      <slot />
    </main>
    <Footerbar />
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