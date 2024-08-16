<template>
  <button
    type="submit"
    class="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
    :disabled="isBusy"
  >
    <div class="flex gap-x-2 justify-center">
      <!-- TODO: We can use a conditional slot to render a custom spinner -->
      <slot></slot>
      <VueSpinner v-if="props.isBusy" size="20" color="white" />
      <p>
        {{ props.title }}
      </p>
    </div>
  </button>
</template>

<script lang="ts" setup>
import { VueSpinner } from 'vue3-spinners';
interface SpinnerButtonProps {
  title: string;
  isBusy?: boolean;
}

const props = defineProps<SpinnerButtonProps>();

</script>