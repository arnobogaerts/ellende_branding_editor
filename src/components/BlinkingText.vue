<template>
  <p class="blinking-cursor">{{ displayText }}</p>
</template>

<style scoped>
.blinking-cursor {
  animation: blinkingText 1s step-start 0s infinite;
  display: inline-block;
}
</style>

<script setup lang="ts">
const props = defineProps<{
  text?: string
}>()

// define a reactive variable that the template can use
const displayText = props.text || '_'
</script>
