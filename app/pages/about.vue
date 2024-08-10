<script setup>
const teamMembers = [
  { name: "John Doe", role: "UI/UX Lead" },
  { name: "John Doe", role: "Lead Developer" },
  { name: "John Doe", role: "Developer" },
  { name: "John Doe", role: "Developer" },
];
</script>

<template>
  <div class="container px-4 py-8 mx-auto">
    <h1 class="mb-8 text-4xl font-bold">Annote</h1>
    <h2 class="mb-8 text-2xl font-bold">A Rich Annotation Tool</h2>

    <div class="mb-12">
      <p class="mb-4">
        An important part of research is connecting the dots between a text and
        other resources, including articles, definitions, images, and videos, as
        well as personal notes.
      </p>
      <p class="mb-4">
        We don't know of any tool that offers a seamless and intuitive way to
        annotate articles while displaying a visual preview of these connections
        for easy reference.
      </p>
      <p class="mb-4">
        Annote is an interactive web app that allows users to effortlessly
        import articles and transform them into interactive learning
        experiences, adding notes, inserting links, embedding images, and
        drawing diagrams that show up conveniently right beside the primary
        text.
      </p>
      <p class="mb-4">
        As users revisit each article, Annote brings each annotation to life
        with dynamic preview cards. Imagine seeing a YouTube thumbnail, a
        snippet from another article, or your own sketch appear right next to
        the relevant paragraph.
      </p>
    </div>

    <h2 class="mb-6 text-3xl font-bold">Contributors</h2>
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      <div
        v-for="member in teamMembers"
        :key="member.name"
        class="p-4 bg-white rounded-lg shadow-md"
      >
        <h3 class="mb-2 text-xl font-semibold text-teal-700">
          {{ member.name }}
        </h3>
        <p class="text-gray-600">{{ member.role }}</p>
      </div>
    </div>
  </div>
</template>
