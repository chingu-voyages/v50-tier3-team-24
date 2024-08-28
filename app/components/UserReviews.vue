<template>
  <section class="py-16">
    <div class="container px-4 mx-auto">
      <h2 class="mb-12 text-4xl font-bold text-center">What Our Users Say</h2>
      <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="(review, index) in reviews"
          :key="index"
          class="p-6 bg-white rounded-lg shadow-md"
        >
          <div class="flex items-center mb-4">
            <img
              :src="review.avatar"
              :alt="review.name"
              class="w-12 h-12 mr-4 rounded-full"
            />
            <div>
              <h3 class="text-lg font-semibold text-teal-500">
                {{ review.name }}
              </h3>
              <p class="text-gray-600">{{ review.title }}</p>
            </div>
          </div>
          <p class="mb-4 text-gray-700">{{ review.comment }}</p>
          <div class="flex text-yellow-500">
            <Icon
              v-for="star in 5"
              :key="star"
              name="mdi:star"
              :class="{ 'text-gray-300': star > review.rating }"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const reviews = [
  {
    name: "Alice Johnson",
    title: "Product Manager",
    avatar: "https://i.pravatar.cc/150?img=1",
    comment:
      "Annote has revolutionized the way I organize my thoughts and ideas. It's an indispensable tool for my daily work.",
    rating: 5,
  },
  {
    name: "Bob Smith",
    title: "Software Developer",
    avatar: "https://i.pravatar.cc/150?img=2",
    comment:
      "The collaboration features in Annote are top-notch. It's made our team's documentation process so much smoother.",
    rating: 4,
  },
  {
    name: "Carol White",
    title: "Content Creator",
    avatar: "https://i.pravatar.cc/150?img=5",
    comment:
      "I love how easy it is to access my notes from any device. Annote has become an essential part of my creative process.",
    rating: 5,
  },
];
</script>
