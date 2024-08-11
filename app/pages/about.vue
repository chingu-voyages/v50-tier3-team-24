<script setup>
import { Icon } from "@iconify/vue";

const teamMembers = [
  {
    name: "Joseph Kotvas",
    role: "UI/UX Lead",
    github: "https://github.com/joekotvas",
    linkedin: "https://www.linkedin.com/in/joekotvas/",
  },
  {
    name: "David Eastmond",
    role: "Lead Developer",
    github: "https://github.com/davideastmond",
    linkedin: "https://www.linkedin.com/in/david-eastmond-2783ab18a/",
  },
  {
    name: "Tandid Alam",
    role: "Developer",
    github: "https://github.com/Tandid",
    linkedin: "https://www.linkedin.com/in/tandidalam/",
  },
  {
    name: "Sabih Sarowar",
    role: "Developer",
    github: "https://github.com/kleenkanteen",
    linkedin: "",
  },
];
</script>

<template>
  <div class="container px-4 py-8 mx-auto">
    <h1 class="mb-8 text-4xl font-bold">Annote</h1>
    <h2 class="mb-8 text-2xl font-bold">A Rich Annotation Tool</h2>

    <div class="mb-12">
      <p class="mb-4">
        An important part of research is
        <strong>connecting the dots</strong> between a text and other resources,
        including articles, definitions, images, and videos, as well as personal
        notes.
      </p>
      <p class="mb-4">
        We don't know of any tool that offers a seamless and intuitive way to
        annotate articles while displaying a <strong>visual preview</strong> of
        these connections for easy reference.
      </p>
      <p class="mb-4">
        <strong>Annote</strong> is an interactive web app that allows users to
        effortlessly import articles and transform them into interactive
        learning experiences, <strong>adding notes</strong>, inserting
        <strong>links</strong>, embedding images, and drawing diagrams that show
        up conveniently <strong>right beside the primary text.</strong>
      </p>
      <p class="mb-4">
        As users revisit each article, <strong>Annote</strong> brings each
        annotation to life with <strong>dynamic preview cards.</strong> Imagine
        seeing a YouTube thumbnail, a snippet from another article, or your own
        sketch appear right next to the relevant paragraph.
      </p>
    </div>

    <h2 class="mb-6 text-3xl font-bold">Contributors</h2>
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="member in teamMembers"
        :key="member.name"
        class="p-4 bg-white rounded-lg shadow-md"
      >
        <h3 class="mb-2 text-xl font-semibold text-teal-700">
          {{ member.name }}
        </h3>
        <p class="text-gray-600">{{ member.role }}</p>
        <div class="flex mt-2 space-x-2">
          <a
            :href="member.github"
            target="_blank"
            rel="noopener noreferrer"
            class="text-gray-700 hover:text-black"
          >
            <Icon icon="mdi:github" class="w-6 h-6" />
          </a>
          <a
            v-if="member.linkedin"
            :href="member.linkedin"
            target="_blank"
            rel="noopener noreferrer"
            class="text-blue-600 hover:text-blue-800"
          >
            <Icon icon="mdi:linkedin" class="w-6 h-6" />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
