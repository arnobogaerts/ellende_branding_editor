<template>
  <div class="drag-window" v-draggable="'.title-bar'">
    <TitleBar>Location</TitleBar>
    <div class="container">
      <div class="column">
        <p v-for="i in x" :key="i">Villa mijnLeuven</p>
        <p>-</p>
      </div>
      <div class="column">
        <p v-for="i in x" :key="i">Onze-Lieve-Vrouwstraat 46</p>
        <p>-</p>
      </div>
      <div class="column">
        <p v-for="i in x" :key="i">3000 Leuven</p>
        <p>-</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  background-color: var(--background-color);
  border: var(--border-size-default) solid var(--text-color);
  display: flex;
  flex-direction: row;
}

.column {
  padding: var(--padding-default);
  width: fit-content;
  white-space: nowrap;
}

.column:first-child,
.column:nth-child(2) {
  border-right: var(--border-size-default) solid var(--text-color);
}
</style>

<script setup lang="ts">
import TitleBar from './templates/TitleBar.vue';

const x = 10;
for (let i = 0; i < x; i++) { }
</script>
