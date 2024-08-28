<template>
  <section class="relative px-4 py-16 overflow-hidden text-center">
    <div class="container relative z-10 mx-auto">
      <h2 class="mb-8 text-4xl font-bold text-gradient">
        Sign up for free today!
      </h2>
      <div class="mb-8 text-2xl">
        <p>Streamline your note-taking and boost productivity.</p>
      </div>
      <NuxtLink
        to="/signup"
        class="inline-flex items-center px-8 py-4 font-bold text-white transition duration-300 bg-gradient-to-r from-[#F1607D] to-pink-500 rounded-xl hover:from-pink-600 hover:to-pink-700"
      >
        Try Annote
      </NuxtLink>
      <NuxtLink
        to="/about"
        class="inline-flex items-center px-8 py-4 font-bold transition duration-300"
      >
        Learn More
        <Icon name="mdi:arrow-right" class="ml-2" />
      </NuxtLink>
    </div>
    <Icon
      name="mdi:note-text-outline"
      class="absolute left-24 text-[#F1607D] transform -translate-y-1/2 opacity-50 top-1/2 text-9xl animate-float-left"
    />
    <Icon
      name="mdi:pencil-outline"
      class="absolute right-24 text-[#F1607D] transform -translate-y-1/2 opacity-50 top-1/2 text-9xl animate-float-right"
    />
  </section>
</template>

<style scoped>
@keyframes floatLeft {
  0%,
  100% {
    transform: translate(-50%, -50%);
  }
  50% {
    transform: translate(-40%, -60%);
  }
}

@keyframes floatRight {
  0%,
  100% {
    transform: translate(50%, -50%);
  }
  50% {
    transform: translate(40%, -40%);
  }
}

.animate-float-left {
  animation: floatLeft 6s ease-in-out infinite;
}

.animate-float-right {
  animation: floatRight 5s ease-in-out infinite;
}

.text-gradient {
  background: linear-gradient(to right, #f1607d, #ff9a8b);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
}
</style>
