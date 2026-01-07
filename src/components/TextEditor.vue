<template>
  <div class="drag-window" v-draggable>
    <TitleBar>Text Editor</TitleBar>
    <div class="note-title">
      <p><b>Vision.txt</b></p>
    </div>
    <div class="container">
      <p ref="noteRef">
        Ellende delivers a raw, dark, and mysterious sound, balancing danceability with a
        thought-provoking edge.
      </p>
      <p>_</p>
    </div>
    <div class="note-information">
      <p class="character-count">{{ wordCount }} words</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import TitleBar from './TitleBar.vue';
import { ref, onMounted } from 'vue';

const noteRef = ref<HTMLElement | null>(null);
const wordCount = ref(0);

onMounted(() => {
  if (!noteRef.value) return;

  const text = noteRef.value.textContent?.trim() ?? '';

  wordCount.value = text === '' ? 0 : text.split(/\s+/).length;
});
</script>

<style scoped>
.container {
  background-color: var(--background-color);
  border: var(--border-size-default) solid var(--text-color);
  width: fit-content;
  box-sizing: border-box;
  padding: var(--padding-default);
  max-width: 350px;
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
