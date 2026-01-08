<template>
  <div class="loading-bar">
    <div
      v-for="n in blocks"
      :key="n"
      class="loading-block"
    />
  </div>
</template>

<style scoped>
.loading-bar {
  display: flex;
  flex-direction: row;
  width: 300px;
  border: var(--border-size-default) solid var(--text-color);
  height: 25px;
  gap: 1px;
  padding: 1px;
}
.loading-block {
  width: 15px;
  height: 25px;
  background-color: var(--text-color);
}
</style>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const blocks = ref(0)
let interval: number

onMounted(() => {
  interval = window.setInterval(() => {
    blocks.value = (blocks.value + 1) % 13
  }, 1000)
})

onBeforeUnmount(() => {
  clearInterval(interval)
})
</script>
