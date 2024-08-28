<template>
  <section class="py-20 bg-white">
    <div class="container mx-auto">
      <div class="relative overflow-hidden">
        <div class="flex animate-ticker">
          <span
            v-for="(company, index) in duplicatedCompanies"
            :key="index"
            class="mx-10 text-3xl font-bold text-transparent whitespace-nowrap bg-clip-text bg-gradient-to-r from-gray-700 to-gray-400"
          >
            {{ company }}
          </span>
        </div>
        <div class="absolute inset-0 pointer-events-none fade-overlay"></div>
      </div>
    </div>
  </section>
</template>

<script setup>
const companies = [
  "Acme Studios",
  "Globex",
  "Hooli",
  "Dunder Mifflin",
  "Oscorp",
];

const duplicatedCompanies = [...companies, ...companies];
</script>

<style scoped>
@keyframes ticker {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

.animate-ticker {
  animation: ticker 30s linear infinite;
  width: fit-content;
}

.fade-overlay {
  background: linear-gradient(
    to right,
    rgb(255, 255, 255) 0%,
    rgba(255, 255, 255, 0.8) 10%,
    rgba(255, 255, 255, 0) 30%,
    rgba(255, 255, 255, 0) 70%,
    rgba(255, 255, 255, 0.8) 90%,
    rgb(255, 255, 255) 100%
  );
  mask-image: linear-gradient(
    to right,
    transparent,
    black 30%,
    black 70%,
    transparent
  );
}
</style>
