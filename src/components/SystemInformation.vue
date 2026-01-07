<template>
  <div class="drag-window" v-draggable>
    <TitleBar>System Information</TitleBar>
    <div class="container">
      <div class="information">
        <p><b>EllendeOS 1.0.5</b></p>
        <p>Build Identifier: EL-12.24</p>
        <p>Memory: 128 KB</p>
        <p>Storage: 2.5 MB</p>
        <p>Network: 2.94 Mbps</p>
      </div>
      <div class="copyright">
        <p>© 2024-2026 Ellende. All rights reserved.</p>
      </div>
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
  width: 350px;
}
.information {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 200px;
}
.copyright {
  border-top: var(--border-size-default) solid var(--text-color);
  display: flex;
  flex-direction: row;
  justify-content: center;
}
</style>
