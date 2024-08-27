<template>
  <section class="px-4 py-16 text-center">
    <h2 class="mb-12 text-4xl font-bold">Key Features</h2>
    <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
      <div
        class="p-6 bg-white border-t-4 border-purple-500 rounded-lg shadow-md"
      >
        <Icon name="mdi:note-outline" class="mb-4 text-5xl text-purple-500" />
        <h3 class="mb-2 text-2xl font-semibold text-purple-800">Smart Notes</h3>
        <p class="text-purple-600">Organize and access your notes with ease</p>
      </div>
      <div
        class="p-6 bg-white border-t-4 border-yellow-500 rounded-lg shadow-md"
      >
        <Icon name="mdi:share-variant" class="mb-4 text-5xl text-yellow-500" />
        <h3 class="mb-2 text-2xl font-semibold text-yellow-700">
          Collaboration
        </h3>
        <p class="text-yellow-600">
          Share and collaborate on notes in real-time
        </p>
      </div>
      <div class="p-6 bg-white border-t-4 border-teal-500 rounded-lg shadow-md">
        <Icon name="mdi:cloud-sync" class="mb-4 text-5xl text-teal-500" />
        <h3 class="mb-2 text-2xl font-semibold text-teal-700">Cloud Sync</h3>
        <p class="text-teal-600">Access your notes from any device, anywhere</p>
      </div>
    </div>
  </section>
</template>
