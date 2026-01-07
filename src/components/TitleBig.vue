<template>
  <div class="drag-window" v-draggable>
    <TitleBar>Title</TitleBar>
    <div class="container">
      <img src="/public/images/ellende_logo_old.png" alt="" />
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
  box-sizing: border-box;
  padding: 5px;
  width: fit-content;
}
.container img {
  width: 500px;
}
</style>
