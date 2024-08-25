<template>
  <Transition>
    <div v-if="props.open" class="fixed w-screen h-screen z-50 bg-transparent left-0 top-0 modalBackdrop">
      <div class="bg-white p-8 mt-[30vh] lg:ml-[30%] lg:mr-[30%]">
        <p> {{ prompt }}</p>
        <div class="flex gap-8 mt-4 justify-center">
          <div>
            <button class="text-[#F64C00] hover:font-bold" @click="handleDelete">Yes</button>
          </div>
          <div>
            <button class="" @click="handleClose">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
  interface DeleteConfirmModalProps {
    prompt: string;
    open: boolean;
    onDelete?: () => void;
    onClose: () => void;
  }

  const props = defineProps<DeleteConfirmModalProps>();

  const handleDelete = () => {
    if (props.onDelete) {
      props.onDelete();
    }
    props.onClose();
  };

  const handleClose = () => {
    props.onClose();
  }
</script>

<style scoped>
  .modalBackdrop {
    background-color: rgba(0,0,0,0.4); /* Black w/ opacity */
  }

  .v-enter-active,
  .v-leave-active {
    transition: opacity 0.5s ease;
  }

  .v-enter-from,
  .v-leave-to {
    opacity: 0;
  }
</style>