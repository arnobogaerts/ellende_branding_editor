<template>
  <div class="drag-window" v-draggable>
    <TitleBar>Console</TitleBar>
    <div class="container">
      <p>DISK:USER > LIST EVENTS</p>
      <p>[14/12/2024] Ellende 1</p>
      <p>[07/03/2025] Ellende 2</p>
      <p>[11/04/2025] Café AperO</p>
      <p>[23/05/2025] Ellende@Stelplaats w/ Sueuga, BOLT RUIN, b–ke</p>
      <p>[22/11/2025] LAB. Ellende</p>
      <br/>
      <p>DISK:USER >_</p>
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
  padding: var(--padding-default);
  max-width: fit-content;
}
</style>
