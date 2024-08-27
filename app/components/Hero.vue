<template>
  <section class="relative flex overflow-hidden modern-gradient">
    <div class="flex items-center w-1/2 p-10">
      <div class="px-12">
        <h1
          class="mb-4 text-4xl font-bold lg:text-6xl animate-fade-in-left gradient-text-primary"
        >
          Welcome to Annote
        </h1>
        <p
          class="mb-8 text-xl animate-fade-in-left animation-delay-300 gradient-text-secondary"
        >
          Streamline your note-taking and boost productivity with our innovative
          annotation tool.
        </p>
        <div
          class="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4"
        >
          <NuxtLink
            to="/new"
            class="px-6 py-3 font-bold text-center text-white transition duration-300 rounded-lg bg-gradient-to-r from-teal-500 to-teal-600 animate-fade-in-up animation-delay-600 hover:from-teal-600 hover:to-teal-700"
          >
            Try Annote
          </NuxtLink>
          <NuxtLink
            to="/about"
            class="px-6 py-3 font-bold text-center transition duration-300 bg-transparent border-2 border-teal-500 rounded-lg hover:bg-gray-200 gradient-text-primary animate-fade-in-up animation-delay-900"
          >
            Learn More
          </NuxtLink>
        </div>
      </div>
    </div>
    <div class="absolute top-0 bottom-0 right-0 w-1/3 pointer-events-none">
      <img
        src="@/public/assets/icons/edit_document.svg"
        class="absolute w-64 h-64 top-1/4 right-1/4 animate-float"
        alt="Vector 1"
      />
      <!-- <img
        src="@/public/assets/icons/edit_document.svg"
        class="absolute w-20 h-20 top-1/2 right-1/3 animate-float animation-delay-300"
        alt="Vector 2"
      /> -->
    </div>
  </section>
</template>
<style scoped>
.modern-gradient {
  background: linear-gradient(135deg, #ffffff, #14b8a6, #ffffff, #14b8a6);
  background-size: 400% 400%;
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.gradient-text-primary {
  background: linear-gradient(to right, #0d9488, #14b8a6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
}

.gradient-text-secondary {
  background: linear-gradient(to right, #374151, #4b5563);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
}
.animate-float {
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0px);
  }
}
</style>
