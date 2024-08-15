<style scoped>
.titleText {
  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000,
    1px 1px 0 #000;
}
</style>
<template>
  <div class="font-sans text-gray-800">
    <!-- Hero Section -->
    <header class="relative px-4 py-20 text-center bg-gray-300">
      <div
        class="absolute inset-0 z-0 bg-center bg-cover"
        style="
          background-image: url('https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?q=80&w=3474&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
        "
      ></div>
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

    <!-- Key Features Section -->
    <section class="px-4 py-16 text-center">
      <h2 class="mb-12 text-4xl font-bold">Key Features</h2>
      <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div
          class="p-6 bg-white border-t-4 border-purple-500 rounded-lg shadow-md"
        >
          <Icon name="mdi:note-outline" class="mb-4 text-5xl text-purple-500" />
          <h3 class="mb-2 text-2xl font-semibold text-purple-800">
            Smart Notes
          </h3>
          <p class="text-purple-600">
            Organize and access your notes with ease
          </p>
        </div>
        <div
          class="p-6 bg-white border-t-4 border-yellow-500 rounded-lg shadow-md"
        >
          <Icon
            name="mdi:share-variant"
            class="mb-4 text-5xl text-yellow-500"
          />
          <h3 class="mb-2 text-2xl font-semibold text-yellow-700">
            Collaboration
          </h3>
          <p class="text-yellow-600">
            Share and collaborate on notes in real-time
          </p>
        </div>
        <div
          class="p-6 bg-white border-t-4 border-teal-500 rounded-lg shadow-md"
        >
          <Icon name="mdi:cloud-sync" class="mb-4 text-5xl text-teal-500" />
          <h3 class="mb-2 text-2xl font-semibold text-teal-700">Cloud Sync</h3>
          <p class="text-teal-600">
            Access your notes from any device, anywhere
          </p>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="px-4 py-16 text-center bg-gray-100">
      <h2 class="mb-12 text-4xl font-bold">How Annote Works</h2>
      <div class="flex flex-col gap-8">
        <!-- Step 1 -->
        <div
          class="flex flex-col items-center gap-4 p-6 bg-white lg:flex-row justify-evenly"
        >
          <div class="flex flex-col gap-8">
            <div class="flex flex-col items-center justify-center">
              <h1
                class="flex items-center justify-center w-12 h-12 mb-4 text-3xl font-bold text-white bg-purple-600 rounded-full"
              >
                1
              </h1>
              <h3 class="mb-2 text-2xl font-semibold text-purple-800">
                Import URL
              </h3>
              <p class="text-purple-600">
                Easily import content from any web page with a single click
              </p>
            </div>

            <!-- <div class="flex flex-col text-start">
              <p>- Lorem ipsum dolor sit amet, consectetur adipiscing elit,</p>
              <p>- Lorem ipsum dolor sit amet, consectetur adipiscing elit,</p>
            </div> -->
          </div>
          <img
            src="https://res.cloudinary.com/dgxqotorm/image/upload/v1723411677/Screenshot_2024-08-11_at_5.26.52_PM_kentbh.png"
            alt="Import URL"
            class="self-center rounded-lg shadow-md lg:w-1/2"
          />
        </div>

        <!-- Step 2 -->
        <div
          class="flex flex-col flex-col-reverse items-center gap-4 p-6 bg-white lg:flex-row justify-evenly"
        >
          <img
            src="https://res.cloudinary.com/dgxqotorm/image/upload/v1723411483/Screenshot_2024-08-11_at_5.23.27_PM_k6zdyd.png"
            alt="Select From Library"
            class="rounded-lg shadow-md lg:w-1/2"
          />
          <div class="flex flex-col gap-8">
            <div class="flex flex-col items-center justify-center">
              <h1
                class="flex items-center justify-center w-12 h-12 mb-4 text-3xl font-bold text-white bg-yellow-600 rounded-full"
              >
                2
              </h1>

              <h3 class="mb-2 text-2xl font-semibold text-yellow-700">
                Select From Library
              </h3>
              <p class="text-yellow-600">
                Access your imported content in your personal library and start
                editing
              </p>
            </div>

            <!-- <div class="flex flex-col text-start">
              <p>- Lorem ipsum dolor sit amet, consectetur adipiscing elit,</p>
              <p>- Lorem ipsum dolor sit amet, consectetur adipiscing elit,</p>
            </div> -->
          </div>
        </div>

        <!-- Step 3 -->
        <div
          class="flex flex-col items-center gap-4 p-6 bg-white lg:flex-row justify-evenly"
        >
          <div class="flex flex-col items-center justify-center gap-8">
            <div class="flex flex-col items-center justify-center">
              <h1
                class="flex items-center justify-center w-12 h-12 mb-4 text-3xl font-bold text-white bg-teal-600 rounded-full"
              >
                3
              </h1>

              <h3 class="mb-2 text-2xl font-semibold text-teal-700">
                Update Document
              </h3>
              <p class="text-teal-600">
                Add notes, highlights, and annotations to enhance your document
              </p>
            </div>

            <!-- <div class="flex flex-col text-start">
              <p>- Lorem ipsum dolor sit amet, consectetur adipiscing elit,</p>
              <p>- Lorem ipsum dolor sit amet, consectetur adipiscing elit,</p>
            </div> -->
          </div>
          <img
            src="https://res.cloudinary.com/dgxqotorm/image/upload/v1723228093/Screenshot_2024-08-09_at_2.20.45_PM_vt81sw.png"
            alt="Update Document"
            class="rounded-lg shadow-md lg:w-1/2"
          />
        </div>
      </div>
    </section>

    <section class="px-4 py-16 text-center">
      <h2 class="mb-8 text-4xl font-bold text-pink-700">
        Ready to get started?
      </h2>
      <NuxtLink
        to="/new"
        class="px-6 py-3 font-bold text-white transition duration-300 bg-pink-500 rounded-lg hover:bg-pink-600"
        >Try Annote</NuxtLink
      >
    </section>
  </div>
</template>
<script setup>
useHead({ title: "Home | Annote" });
</script>