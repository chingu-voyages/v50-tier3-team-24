<template>
  <div class="font-sans text-gray-800">
    <header class="px-4 py-20 text-center bg-gray-100">
      <h1 class="mb-4 text-5xl font-bold">Welcome to Annote</h1>
      <p class="mb-8 text-2xl">
        Streamline your note-taking and boost productivity
      </p>
      <NuxtLink
        to="/new"
        class="px-6 py-3 font-bold text-white transition duration-300 bg-blue-600 rounded-lg hover:bg-blue-700"
        >Get Started</NuxtLink
      >
    </header>

    <section class="px-4 py-16 text-center">
      <h2 class="mb-12 text-4xl font-bold">Key Features</h2>
      <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div class="p-6 rounded-lg shadow-md">
          <Icon name="mdi:note-outline" class="mb-4 text-5xl" />
          <h3 class="mb-2 text-2xl font-semibold">Smart Notes</h3>
          <p>Organize and access your notes with ease</p>
        </div>
        <div class="p-6 rounded-lg shadow-md">
          <Icon name="mdi:share-variant" class="mb-4 text-5xl" />
          <h3 class="mb-2 text-2xl font-semibold">Collaboration</h3>
          <p>Share and collaborate on notes in real-time</p>
        </div>
        <div class="p-6 rounded-lg shadow-md">
          <Icon name="mdi:cloud-sync" class="mb-4 text-5xl" />
          <h3 class="mb-2 text-2xl font-semibold">Cloud Sync</h3>
          <p>Access your notes from any device, anywhere</p>
        </div>
      </div>
    </section>

    <section class="px-4 py-16 text-center">
      <h2 class="mb-12 text-4xl font-bold">How Annote Works</h2>

      <div class="flex flex-col gap-8">
        <!-- Step 1 -->
        <div class="flex items-center p-6 justify-evenly">
          <div>
            <div class="mb-4 text-3xl font-bold text-blue-600">1</div>
            <h3 class="mb-2 text-2xl font-semibold">Import URL</h3>
            <p>Easily import content from any web page with a single click</p>
          </div>
          <img
            src="https://res.cloudinary.com/dgxqotorm/image/upload/v1723228093/Screenshot_2024-08-09_at_2.20.45_PM_vt81sw.png"
            alt="Import URL"
            class="w-1/2 rounded-lg"
          />
        </div>

        <!-- Step 2 -->
        <div class="flex items-center p-6 justify-evenly">
          <img
            src="https://res.cloudinary.com/dgxqotorm/image/upload/v1723228093/Screenshot_2024-08-09_at_2.20.45_PM_vt81sw.png"
            alt="Select From Library"
            class="w-1/2 rounded-lg"
          />
          <div>
            <div class="mb-4 text-3xl font-bold text-blue-600">2</div>
            <h3 class="mb-2 text-2xl font-semibold">Select From Library</h3>
            <p>
              Access your imported content in your personal library and start
              editing
            </p>
          </div>
        </div>

        <!-- Step 3 -->
        <div class="flex items-center p-6 justify-evenly">
          <div>
            <div class="mb-4 text-3xl font-bold text-blue-600">3</div>
            <h3 class="mb-2 text-2xl font-semibold">Update Document</h3>
            <p>
              Add notes, highlights, and annotations to enhance your document
            </p>
          </div>
          <img
            src="https://res.cloudinary.com/dgxqotorm/image/upload/v1723228093/Screenshot_2024-08-09_at_2.20.45_PM_vt81sw.png"
            alt="Update Document"
            class="w-1/2 rounded-lg"
          />
        </div>
      </div>
    </section>

    <section class="px-4 py-16 text-center">
      <h2 class="mb-8 text-4xl font-bold">Ready to get started?</h2>
      <NuxtLink
        to="/new"
        class="px-6 py-3 font-bold text-white transition duration-300 bg-blue-600 rounded-lg hover:bg-blue-700"
        >Try Annote for Free</NuxtLink
      >
    </section>
  </div>
</template>

<script setup></script>
