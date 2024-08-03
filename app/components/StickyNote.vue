<template>
  <div
    class="relative p-2 m-2 shadow-md h-60 w-60"
    :style="{ backgroundColor: color }"
  >
    <div
      class="absolute top-0 left-0 px-2 py-1 text-xs text-black bg-white rounded-br"
    >
      {{ pinNumber }}
    </div>
    <div class="absolute top-0 right-0 delete-button pr-2">
      <button>
        <Icon name="mdi:window-close" />
      </button>
    </div>
    <div class="mt-4">
      <div>
        <input
          v-model="title"
          type="text"
          class="w-full text-sm bg-transparent border-none focus:outline-none"
          placeholder="Title" />
      </div>
      <div>
        <textarea
          v-model="body"
          placeholder="Add your note here..."
          class="w-full h-full pt-2 text-sm bg-transparent border-none resize-none focus:outline-none"
        />
      </div>
    </div>
    <div class="absolute bottom-0 w-full edit-controls-section">
      <div class="flex justify-end pr-4">
        <button @click="handleUpdateCreateClick">
          <Icon name="mdi:check" />
        </button>        
        <button @click="handleCancelClick">
          <Icon name="mdi:close" />
        </button>
        <button>
          <Icon name="mdi:pencil" />
        </button>        
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ActionType } from '../../types/sticky/action-type/action-type';
import type { StickyCreateActionData } from '../../types/sticky/sticky-create-action-data/sticky-create-action-data';

interface StickyNoteProps {
  color: string;
  pinNumber: number; // The number on the pin (also the anchor)
  documentId: string; // documentId is the id of the document this sticky note belongs to
  isNew?: boolean; // If this is a new sticky note
  stickyData?: Partial<Sticky>;
  readonly?: boolean
  title?: string | null;

  onUpdateCreate?: (action: ActionType, data: StickyCreateActionData) => void;
  onDelete?: (sticky_id: string) => void;
  onCancel?: () => void;
}

const props = defineProps<StickyNoteProps>();
const readOnly: boolean = ref<boolean>(!!props.readonly);

const title = ref<string>(props.stickyData?.title || props.title || "");
const body = ref<string>(props.stickyData?.body || "");

function handleUpdateCreateClick () {
  props.onUpdateCreate && props.onUpdateCreate(getAction(), {
    document_id: props.documentId,
    sticky_type: "sticky", // TODO: This needs to be dynamic as it can be video or link
    title: title.value,
    body: body.value,
    color: props.color,
    anchor: props.pinNumber,
  })
}

function handleCancelClick () {
  props.onCancel && props.onCancel();
}

function getAction (): ActionType {
  return props.isNew ? "create" : "update";
}
</script>
