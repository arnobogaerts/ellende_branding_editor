<template>
  <div class="drag-window" v-draggable>
    <TitleBar>Image Viewer</TitleBar>
    <div class="container">
      <img :src="imageSource" :style="{ width: imageWidth, padding: containerPadding }" :class="{ color: color }" />
    </div>
  </div>
</template>

<script setup lang="ts">
import TitleBar from './TitleBar.vue';

const props = defineProps<{
  image?: string
  width?: string
  padding?: string
  color?: boolean
}>()

const imageSource = props.image || '/public/images/ellende_logo.png'
const imageWidth = props.width || '150px'
const containerPadding = props.padding || '10px'
</script>

<style scoped>
.container {
  background-color: var(--background-color);
  border: var(--border-size-default) solid var(--text-color);
  width: fit-content;
  box-sizing: border-box;
}

img {
  display: block;
}

.color {
  filter: grayscale(1);
  image-rendering: pixelated;
}
</style>
