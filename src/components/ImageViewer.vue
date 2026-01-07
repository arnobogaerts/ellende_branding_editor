<template>
  <div class="drag-window" v-draggable>
    <TitleBar>Image Viewer</TitleBar>
    <div class="container">
      <img src="/public/images/cushion.png" alt="" />
    </div>
  </div>
</template>

<script setup lang="ts">
import TitleBar from './TitleBar.vue';
</script>

<style scoped>
.container {
  background-color: var(--background-color);
  border: var(--border-size-default) solid var(--text-color);
  width: fit-content;
  box-sizing: border-box;
  padding: 15px;
}
.container img {
  width: 150px;
}
</style>
