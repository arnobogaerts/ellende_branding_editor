<template>
  <div class="drag-window" v-draggable="'.title-bar'">
    <TitleBar>Video</TitleBar>
    <div class="container">
      <video :src="videoSource" :style="{ width: imageWidth, padding: containerPadding }" controls />
    </div>
  </div>
</template>

<script setup lang="ts">
import TitleBar from './TitleBar.vue';

const props = withDefaults(
  defineProps<{
    video?: string
    width?: string
    padding?: string
  }>(), {
  width: '125px',
}
)

const videoSource = props.video || '/public/images/ellende_logo.png'
const imageWidth = props.width || '150px'
const containerPadding = props.padding || '5px'
</script>

<style scoped>
.container {
  background-color: var(--background-color);
  border: var(--border-size-default) solid var(--text-color);
  width: fit-content;
  box-sizing: border-box;
}

video {
  display: block;
  filter: grayscale(1);
}
</style>
