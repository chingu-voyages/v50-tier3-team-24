<template>
  <section class="py-16">
    <div class="container px-4 mx-auto">
      <h2 class="mb-16 text-4xl font-bold text-center text-gray-800">
        Simplify Your Workflow with Annote
      </h2>
      <div class="space-y-24">
        <!-- Step 1 -->
        <div class="flex flex-col items-center md:flex-row">
          <div class="mb-8 md:w-1/2 md:mb-0 md:pr-8">
            <div class="flex items-center mb-4">
              <div
                class="flex items-center justify-center w-12 h-12 mr-4 text-xl font-bold text-white bg-purple-600 rounded-full"
              >
                1
              </div>
              <h3 class="text-2xl font-semibold text-purple-800">
                Instant Web Import
              </h3>
            </div>
            <p class="text-gray-600">
              Seamlessly capture web content with a single click, transforming
              any page into your personal canvas
            </p>
          </div>
          <div class="md:w-1/2">
            <img
              src="https://res.cloudinary.com/dgxqotorm/image/upload/v1723411677/Screenshot_2024-08-11_at_5.26.52_PM_kentbh.png"
              alt="Instant Web Import"
              class="w-full transition-transform duration-300 transform rounded-lg shadow-lg rotate-2 hover:rotate-0"
            />
          </div>
        </div>

        <!-- Step 2 -->
        <div class="flex flex-col items-center md:flex-row-reverse">
          <div class="mb-8 md:w-1/2 md:mb-0 md:pl-8">
            <div class="flex items-center mb-4">
              <div
                class="flex items-center justify-center w-12 h-12 mr-4 text-xl font-bold text-white bg-yellow-600 rounded-full"
              >
                2
              </div>
              <h3 class="text-2xl font-semibold text-yellow-700">
                Smart Content Library
              </h3>
            </div>
            <p class="text-gray-600">
              Dive into your personalized knowledge hub, where all your imported
              content awaits your creative touch
            </p>
          </div>
          <div class="md:w-1/2">
            <img
              src="https://res.cloudinary.com/dgxqotorm/image/upload/v1723411483/Screenshot_2024-08-11_at_5.23.27_PM_k6zdyd.png"
              alt="Smart Content Library"
              class="w-full transition-transform duration-300 transform rounded-lg shadow-lg rotate-neg-2 hover:rotate-0"
            />
          </div>
        </div>

        <!-- Step 3 -->
        <div class="flex flex-col items-center md:flex-row">
          <div class="mb-8 md:w-1/2 md:mb-0 md:pr-8">
            <div class="flex items-center mb-4">
              <div
                class="flex items-center justify-center w-12 h-12 mr-4 text-xl font-bold text-white bg-pink-600 rounded-full"
              >
                3
              </div>
              <h3 class="text-2xl font-semibold text-pink-700">
                Dynamic Document Enhancement
              </h3>
            </div>
            <p class="text-gray-600">
              Elevate your content with intuitive annotations, vibrant
              highlights, and insightful notes, bringing your ideas to life
            </p>
          </div>
          <div class="md:w-1/2">
            <img
              src="https://res.cloudinary.com/dgxqotorm/image/upload/v1723228093/Screenshot_2024-08-09_at_2.20.45_PM_vt81sw.png"
              alt="Dynamic Document Enhancement"
              class="w-full transition-transform duration-300 transform rounded-lg shadow-lg rotate-2 hover:rotate-0"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.rotate-2 {
  transform: rotate(2deg);
}

.rotate-neg-2 {
  transform: rotate(-2deg);
}

.hover\:rotate-0:hover {
  transform: rotate(0deg);
}
</style>
