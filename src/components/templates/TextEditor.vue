<template>
  <div class="drag-window" v-draggable="'.title-bar'">
    <TitleBar>Text Editor</TitleBar>
    <div class="note-title">
      <div class="editable-text-area editable-text-area-title" contenteditable>Title.txt</div>
    </div>
    <div class="container" :style="{ width }">
      <span>
        <div ref="textareaRef" contenteditable @input="onInput" class="editable-text-area"></div>
        <BlinkingText>
          <p>_</p>
        </BlinkingText>
      </span>
    </div>
    <div class="note-information">
      <p class="character-count">{{ wordCount }} words</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import TitleBar from './TitleBar.vue';
import { ref, computed } from 'vue';
import BlinkingText from './BlinkingText.vue';

const props = defineProps<{
  title?: string
  text?: string
  width?: string
}>()

const textareaRef = ref<HTMLElement | null>(null);
const text = ref(props.text || '');

const wordCount = computed(() => {
  const t = text.value.trim();
  return t === '' ? 0 : t.split(/\s+/).length;
});

function onInput(e: Event) {
  text.value = (e.target as HTMLElement).innerText;
}
</script>

<style scoped>
.container {
  background-color: var(--background-color);
  border: var(--border-size-default) solid var(--text-color);
  box-sizing: border-box;
  padding: var(--padding-default);
  width: fit-content;
}

.note-title {
  background-color: var(--background-color);
  border: var(--border-size-default) solid var(--text-color);
  border-bottom: none;
  padding: var(--padding-default);
}

.note-information {
  background-color: var(--background-color);
  border: var(--border-size-default) solid var(--text-color);
  border-top: none;
  padding: var(--padding-default);
}
</style>
