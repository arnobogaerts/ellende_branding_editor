<template>
  <span class="blinking-text">
    <slot>{{ displayText }}</slot>
  </span>
</template>

<script setup lang="ts">
defineProps<{
  displayText?: string
}>()
</script>

<style scoped>
.blinking-text {
  display: inline-block;
  animation: blink-animation 1s steps(2, start) infinite;
  pointer-events: none;
}

@keyframes blink-animation {
  to {
    visibility: hidden;
  }
}
</style>
