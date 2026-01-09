<template>
  <div class="drag-window" v-draggable>
    <TitleBar>Task Manager</TitleBar>
    <div class="container">
      <p>Core Values:</p>
      <br/>
      <p>[x] Open doors for everyone</p>
      <br/>
      <p>[x] Focus on music and atmosphere</p>
      <br/>
      <p>[x] Showcase and support artists of every background, experience, and style</p>
      <br/>
      <p>[x] Maintain a safe, open, and respectful space for everyone<BlinkingText/></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import BlinkingText from './BlinkingText.vue';
import TitleBar from './TitleBar.vue';
</script>

<style scoped>
.container {
  background-color: var(--background-color);
  border: var(--border-size-default) solid var(--text-color);
  width: fit-content;
  box-sizing: border-box;
  padding: 15px;
  max-width: 300px;
}
</style>
