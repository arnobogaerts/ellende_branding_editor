<template>
  <div class="container drag-window" v-draggable>
    <h2>{{ month }}</h2>
    <h2>{{ day }}</h2>
  </div>
</template>

<style scoped>
.container {
  background-color: var(--background-color);
  width: 100px;
  height: 100px;
  border: var(--border-size-default) solid var(--text-color);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>

<script setup lang="ts">
withDefaults(
  defineProps<{
    month?: string
    day?: number
  }>(),
  {
    month: 'FEB',
    day: 22,
  }
)
</script>
