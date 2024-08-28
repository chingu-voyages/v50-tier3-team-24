<template>
  <section class="py-12">
    <div class="container mx-auto">
      <div class="relative overflow-hidden">
        <div class="flex animate-ticker">
          <div
            v-for="(company, index) in duplicatedCompanies"
            :key="index"
            class="flex items-center mx-10"
          >
            <Icon :name="company.icon" class="w-10 h-10 mr-3 text-gray-700" />
            <span
              :class="[
                'text-3xl font-bold whitespace-nowrap text-transparent bg-clip-text bg-gradient-to-r from-gray-700 to-gray-400',
                company.font,
              ]"
            >
              {{ company.name }}
            </span>
          </div>
        </div>
        <div class="absolute inset-0 pointer-events-none fade-overlay"></div>
      </div>
    </div>
  </section>
</template>

<script setup>
const companies = [
  { name: "Acme Studios", icon: "mdi:alpha-a-circle", font: "font-serif" },
  { name: "Globex", icon: "mdi:earth", font: "font-sans" },
  { name: "Hooli", icon: "mdi:alpha-h-circle", font: "font-mono" },
  { name: "Dunder Mifflin", icon: "mdi:file-document", font: "font-cursive" },
  { name: "Oscorp", icon: "mdi:atom", font: "font-futuristic" },
];

const duplicatedCompanies = [...companies, ...companies];
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Roboto+Slab&family=Courier+Prime&family=Dancing+Script&family=Orbitron&display=swap");

.font-serif {
  font-family: "Roboto Slab", serif;
}
.font-mono {
  font-family: "Courier Prime", monospace;
}
.font-cursive {
  font-family: "Dancing Script", cursive;
}
.font-futuristic {
  font-family: "Orbitron", sans-serif;
}

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
