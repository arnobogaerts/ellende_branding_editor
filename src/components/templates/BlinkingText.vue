<template>
  <span class="blinking-text" :style="{ visibility: visible ? 'visible' : 'hidden' }">
    <slot>{{ displayText }}</slot>
  </span>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';

defineProps<{
  displayText?: string
}>()

const visible = ref(true);
let intervalId: number | null = null;

onMounted(() => {
  // Toggle visibility every 500ms
  intervalId = window.setInterval(() => {
    visible.value = !visible.value;
  }, 500);
});

onBeforeUnmount(() => {
  if (intervalId !== null) clearInterval(intervalId);
});
</script>

<style scoped>
.blinking-text {
  display: inline-block;
}
</style>
