<template>
  <div class="drag-window" v-draggable>
    <TitleBar>Web Viewer</TitleBar>
    <div class="adress-bar">
      <p>Network://hotstuff/index</p>
    </div>
    <div class="container">
      <div class="column first-column"><BlowJob /></div>
      <div class="column second-column">
        <p class="website-title">Horny couples looking for adventures!</p>
        <br/>
        <p>Explore the latest encounters from adventurous couples around the globe. Browse, connect, and dive into curated stories that are guaranteed to turn up the heat.</p>
        <br/>
        <BlinkingText text="!!! JOIN NOW !!!" />
      </div>
    </div>
    <div class="footer-bar">
      <p>Size: 24 KB</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import TitleBar from './TitleBar.vue';
import BlowJob from './svg/BlowJob.vue';
import BlinkingText from './BlinkingText.vue';
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: row;
  background-color: var(--background-color);
  border: var(--border-size-default) solid var(--text-color);
  max-width: 500px;
  gap: 25px;
  box-sizing: border-box;
  overflow: hidden;
}
.column {
  display: flex;
  max-height: 300px;
}
.first-column {
  justify-content: flex-start;
  height: 300px;
}
.second-column {
  flex-direction: column;
  padding: var(--padding-default);
}
.website-title {
  font-size: 25px;
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
