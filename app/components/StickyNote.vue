<template>
  <div class="h-48 p-2 shadow-md w-60" :style="{ backgroundColor: bgColor }">
    <textarea
      v-model="modelValue"
      placeholder="Add your note here..."
      class="w-full h-full text-sm bg-transparent border-none resize-none focus:outline-none"
      @input="$emit('update:modelValue', $event.target.value)"
    ></textarea>
  </div>
</template>

<script>
import { computed, defineComponent } from "vue";

export default defineComponent({
  props: ["modelValue", "color"],
  emits: ["update:modelValue"],
  setup(props) {
    const bgColor = computed(() => {
      // Map color name to actual color or use a default
      const colorMap = {
        blue: "#0084C3",
        pink: "#F1607D",
        red: "#F64C00",
        gold: "#CEA000",
        green: "#02A856",
        teal: "#03A58D",
        purple: "#821EB1",
      };
      return colorMap[props.color] || "#f0f0f0";
    });

    return { bgColor };
  },
});
</script>
