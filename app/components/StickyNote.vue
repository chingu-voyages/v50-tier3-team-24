<template>
  <div
    class="relative p-2 m-2 shadow-md h-auto w-60 border-l-4"
    :style="{ backgroundColor: 'white', borderLeftColor: rgbaColor }"
  >
    <div class="pin-title-enclosure flex w-full border-b-2 pb-2" :style="{ borderBottomColor: rgbaColor }">
      <div
        class="absolute top-0 left-0 px-2 py-1 !text-sm text-white font-cabin font-bold pin"
        :style="{ backgroundColor: color }"
      >
        {{ pinNumber }}
      </div>
      <div>
        <p v-if="readOnly" class="text-lg font-cabin leading-5 mr-2" :style="{ color: color, height: 'auto' }">{{ title }}</p>
        <textarea
          v-else
          v-model="title"
          type="text"
          class="sticky-title w-52 text-lg bg-transparent border-none focus:outline-none font-cabin leading-5"
          :style="{ color: color, height: 'auto' }"
          placeholder="Title"
          maxlength="200"
        />
      </div>
      <div v-if="canEdit" class="absolute top-0 right-0 ml-4">
        <button class="p-2" @click="toggleMenuOpen">
          <Icon class="self-center" name="mdi:dots-vertical" :style="{ color: color }" />
        </button>
        <div v-if="menuOpen" class="dropdown-menu absolute right-0 shadow-xl bg-white z-50" v-click-outside="toggleMenuOpen">
          <ul class="bg-white border border-gray-300 rounded">
            <button class="w-full" :disabled="!readOnly" @click="handleEditMenuClick">
              <li class="p-2 hover:bg-gray-100">Edit</li>
            </button>
          </ul>
        </div>  
      </div>
    </div>
    <div class="pb-2">
      <div v-if="readOnly" class="flex border-b justify-between" :style="{ borderBottomColor: rgbaColor }"> 
        <p class="text-sm font-cabin text-gray-500">{{ stickyData?.author || "No author" }}</p>
        <div class="flex items-center">
          <Icon name="mdi:link" class="text-gray-500 self-center" />
          <NuxtLink :to="source_url" target="_blank">
            <p class="text-sm font-cabin text-gray-500 source-url">{{ source_url }}</p>
          </NuxtLink> 
        </div>
      </div>
      <div v-else class="flex border-b" :style="{ borderBottomColor: rgbaColor }">
        <input type="text" class="w-full text-sm bg-transparent border-none focus:outline-none font-cabin" placeholder="Add author..." />
        <div class="flex">
          <Icon name="mdi:link" />
          <input v-model="source_url" type="text" class="w-full text-sm bg-transparent border-none focus:outline-none font-cabin" placeholder="Add link..." />
        </div>
      </div>
    </div>
    <div>
      <div>
        <p v-if="readOnly" class="text-lg font-cabin overflow-y-auto read-only-body">{{ body }}</p>
        <textarea
          v-else
          v-model="body"
          placeholder="Type your note here..."
          class="w-full h-full text-lg bg-transparent border-none resize-none focus:outline-none font-cabin"
        />
      </div>
    </div>
    <div class="absolute bottom-0 w-full edit-controls-section">
      <div v-if="!readOnly" class="flex justify-end pr-4">
        <button @click="handleUpdateCreateClick">
          <Icon name="mdi:check" />
        </button>
        <button @click="handleCancelClick">
          <Icon name="mdi:close" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ActionType } from '~/types/sticky/action-type/action-type';
import type { StickyCreateActionData, StickyUpdateActionData } from '~/types/sticky/sticky-action-data/sticky-action-data';

interface StickyNoteProps {
  color: string;
  pinNumber: number; // The number on the pin (also the anchor)
  documentId: string; // documentId is the id of the document this sticky note belongs to
  uuid?: string;
  isNew?: boolean; // If this is a new sticky note
  stickyData?: Partial<Sticky | VideoSticky | LinkSticky>;
  readonly?: boolean
  canEdit?: boolean;
  title?: string | null;
  onUpdateCreate?: (action: ActionType, data: StickyCreateActionData | StickyUpdateActionData) => void;
  onCancel?: () => void;
}

const props = defineProps<StickyNoteProps>();

const title = ref<string>(props.stickyData?.title || props.title || "");
const body = ref<string>(props.stickyData?.body || "");
const source_url = ref<string>((props.stickyData as VideoSticky)?.source_url || "");
const rgbaColor = getRgbByHexColor(props.color);

const menuOpen = ref<boolean>(false);

const readOnly = ref<boolean>(props.readonly);

function toggleMenuOpen () {
  menuOpen.value = !menuOpen.value;
}

function handleUpdateCreateClick () {
  props.onUpdateCreate && props.onUpdateCreate(getAction(), {
    document_id: props.documentId,
    sticky_type: "sticky", // TODO: This needs to be dynamic as it can be video or link
    title: title.value,
    body: body.value,
    color: props.color,
    anchor: props.pinNumber,
    sticky_id: props.uuid!,
    source_url: source_url.value,
  });
  toggleReadOnly();
}

function handleCancelClick () {
  toggleReadOnly();
  props.onCancel && props.onCancel();
}

function getAction (): ActionType {
  return props.isNew ? "create" : "update";
}

function handleEditMenuClick () {
  toggleMenuOpen();
  toggleReadOnly();
}

function toggleReadOnly () {
  readOnly.value = !readOnly.value;
}
</script>

<style scoped>
  .pin {
    width: 16px;
    height: 17px;
    border-radius: 4px;
  }
  textarea.sticky-title {
    resize: none;
    overflow: hidden;
  }
  button:disabled {
    cursor: not-allowed;
  }

  .source-url {
    max-height: 20px;
    max-width: 130px;
    overflow: hidden;
  }
  .read-only-body {
    max-height: 90px; 
  }
</style>