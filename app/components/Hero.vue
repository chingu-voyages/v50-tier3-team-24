<template>
  <section
    class="relative flex flex-col overflow-hidden md:flex-row modern-gradient rounded-xl"
  >
    <div class="flex items-center w-full p-6 md:w-1/2 md:p-10">
      <div class="px-4 md:px-12">
        <h1
          class="mb-4 text-3xl font-bold md:text-4xl lg:text-6xl animate-fade-in-left gradient-text-primary"
        >
          Welcome to Annote
        </h1>
        <p
          class="mb-8 text-lg md:text-xl animate-fade-in-left animation-delay-300 gradient-text-secondary"
        >
          Streamline your note-taking and boost productivity with our innovative
          annotation tool.
        </p>
        <div
          class="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4"
        >
          <NuxtLink
            to="/new"
            class="px-6 py-3 font-bold text-center text-white transition duration-300 rounded-lg bg-gradient-to-r from-teal-500 to-teal-600 animate-fade-in-up animation-delay-600 hover:from-teal-600 hover:to-teal-700 z-1"
          >
            Try Annote
          </NuxtLink>
          <NuxtLink
            to="/about"
            class="inline-flex items-center px-2 font-bold transition duration-300"
          >
            Learn More
            <Icon name="mdi:arrow-right" class="ml-2" />
          </NuxtLink>
        </div>
      </div>
    </div>
    <div class="relative w-full h-64 md:w-1/2 md:h-auto">
      <img
        src="@/public/assets/icons/hero1.svg"
        class="absolute w-48 h-48 top-5 md:w-96 md:h-96 right-1/4 floating-image-1"
        alt="Vector 1"
      />
      <img
        src="@/public/assets/icons/hero2.svg"
        class="absolute w-16 h-16 md:w-32 md:h-32 top-1/2 right-3/4 floating-image-2 animation-delay-400"
        alt="Vector 2"
      />
      <img
        src="@/public/assets/icons/hero3.svg"
        class="absolute w-12 h-12 md:w-24 md:h-24 top-1/4 right-20 floating-image-3 animation-delay-300"
        alt="Vector 3"
      />
      <img
        src="@/public/assets/icons/hero4.svg"
        class="absolute w-10 h-10 md:w-20 md:h-20 top-2/3 right-10 floating-image-4 animation-delay-300"
        alt="Vector 4"
      />
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

@keyframes float-1 {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes float-2 {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-15px);
  }
}

@keyframes float-3 {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-25px);
  }
}

@keyframes float-4 {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-30px);
  }
}

.floating-image-1 {
  animation: float-1 10s ease-in-out infinite;
}

.floating-image-2 {
  animation: float-2 5s ease-in-out infinite;
}

.floating-image-3 {
  animation: float-3 6s ease-in-out infinite;
}

.floating-image-4 {
  animation: float-4 7s ease-in-out infinite;
}
</style>
