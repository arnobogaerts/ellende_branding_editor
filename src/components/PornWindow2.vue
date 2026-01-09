<template>
  <div class="drag-window" v-draggable>
    <TitleBar>Web Viewer</TitleBar>
    <div class="adress-bar">
      <p>Network://sexypeople/page_02</p>
    </div>
    <div class="container">
      <p>-----------------------------------------</p>
      <p><b>Home | Models | Membership</b></p>
      <p>-----------------------------------------</p>
      <WomanOne />
      <p>-----------------------------------------</p>
      <p class="website-title">Step into desire...</p>
      <p>Browse exclusive content from daring models.</p>
      <BlinkingText text="EXPLORE MORE!" />
    </div>
    <div class="footer-bar">
      <p>Size: 19 KB</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import BlinkingText from './BlinkingText.vue';
import TitleBar from './TitleBar.vue';
import WomanOne from './svg/WomanOne.vue';
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  background-color: var(--background-color);
  border: var(--border-size-default) solid var(--text-color);
  max-width: 300px;
  box-sizing: border-box;
  overflow: hidden;
  padding: 10px;
  gap: 10px;
}
.website-title {
  font-size: 20px;
  font-weight: bold;
}

.adress-bar {
  background-color: var(--background-color);
  border: var(--border-size-default) solid var(--text-color);
  border-bottom: none;
  padding: var(--padding-default);
}

.footer-bar {
  background-color: var(--background-color);
  border: var(--border-size-default) solid var(--text-color);
  border-top: none;
  padding: var(--padding-default);
}
</style>
