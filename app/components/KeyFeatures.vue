<template>
  <section class="px-4 py-16 text-center app-surface app-theme-transition">
    <h2 class="mb-12 text-4xl font-bold app-text">Key Features</h2>
    <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
      <div class="p-6 app-surface app-theme-transition border-t-4 rounded-lg shadow-md feature-border-purple">
        <Icon name="mdi:note-outline" class="mb-4 text-5xl feature-icon-purple" />
        <h3 class="mb-2 text-2xl font-semibold app-text">Smart Notes</h3>
        <p class="app-text-muted">Organize and access your notes with ease</p>
      </div>
      <div class="p-6 app-surface app-theme-transition border-t-4 rounded-lg shadow-md feature-border-pink">
        <Icon name="mdi:share-variant" class="mb-4 text-5xl feature-icon-pink" />
        <h3 class="mb-2 text-2xl font-semibold app-text">Collaboration</h3>
        <p class="app-text-muted">Share and collaborate on notes in real-time</p>
      </div>
      <div class="p-6 app-surface app-theme-transition border-t-4 rounded-lg shadow-md feature-border-yellow">
        <Icon name="mdi:cloud-sync" class="mb-4 text-5xl feature-icon-yellow" />
        <h3 class="mb-2 text-2xl font-semibold app-text">Cloud Sync</h3>
        <p class="app-text-muted">Access your notes from any device, anywhere</p>
      </div>
    </div>
  </section>
</template>
<style scoped>
/* Added for landing page */
.feature-border-purple {
  border-top-color: #a78bfa !important;
}

.feature-border-pink {
  border-top-color: #f472b6 !important;
}

.feature-border-yellow {
  border-top-color: #fde68a !important;
}

.feature-icon-purple {
  color: #a78bfa !important;
}

.feature-icon-pink {
  color: #f472b6 !important;
}

.feature-icon-yellow {
  color: #fde68a !important;
}
</style>