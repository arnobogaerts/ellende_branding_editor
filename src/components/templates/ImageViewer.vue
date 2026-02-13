<template>
  <div class="drag-window" v-draggable="'.title-bar'">
    <TitleBar>Image</TitleBar>
    <div class="container">
      <img :src="imageSource" :style="{ width: imageWidth, padding: containerPadding }" />
    </div>
  </div>
</template>

<script setup lang="ts">
import TitleBar from './TitleBar.vue';

const props = withDefaults(
  defineProps<{
    image?: string
    width?: string
    padding?: string
  }>(), {
  width: '125px',
}
)

const imageSource = props.image || '/public/images/ellende_logo.png'
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

img {
  display: block;
  filter: grayscale(1);
  image-rendering: pixelated;
  image-rendering: crisp-edges;
}
</style>
