<template>
  <div class="drag-window" v-draggable>
    <TitleBar>Web Viewer</TitleBar>
    <div class="bar adress-bar">
      <p>Network://{{ adress }}</p>
    </div>
    <div class="container" :style="{ flexDirection, height, width }">
      <slot></slot>
    </div>
    <div class="bar footer-bar">

      <p>Size: {{ websiteSize }} KB</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import TitleBar from './TitleBar.vue';
import { ref } from 'vue';
withDefaults(defineProps<{
  adress?: string
  height?: string
  width?: string
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse'
}>(), {
  flexDirection: 'column',
  height: 'fit-content'
})
const websiteSize = ref(
  Math.floor(Math.random() * 91) + 10
)
</script>

<style scoped>
.container {
  display: flex;
  background-color: var(--background-color);
  border: var(--border-size-default) solid var(--text-color);
  box-sizing: border-box;
  overflow: hidden;
  padding: var(--padding-default);
  gap: 10px;
}

.bar {
  background-color: var(--background-color);
  border: var(--border-size-default) solid var(--text-color);
  padding: var(--padding-default);
}

.adress-bar {
  border-bottom: none;
}

.footer-bar {
  border-top: none;
}
</style>
