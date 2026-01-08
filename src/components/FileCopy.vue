<template>
  <div class="drag-window" v-draggable>
    <TitleBar>File Copy</TitleBar>
    <div class="container">
      <p>Copying upcoming events to disk...</p>
        <LoadingBar/>
        <StandardButton>Cancel</StandardButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import TitleBar from './TitleBar.vue';
import StandardButton from './StandardButton.vue';
import LoadingBar from './LoadingBar.vue';
</script>

<style scoped>
.container {
  background-color: var(--background-color);
  border: var(--border-size-default) solid var(--text-color);
  width: fit-content;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 15px 5px;
  gap: 15px;
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
