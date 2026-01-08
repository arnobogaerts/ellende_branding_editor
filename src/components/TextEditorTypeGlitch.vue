<template>
  <div class="drag-window" v-draggable>
    <TitleBar>Text Editor</TitleBar>

    <div class="note-title">
      <p><b>Randomized.txt</b></p>
    </div>

    <div class="container">
      <p ref="noteRef">
        <span ref="typedSpan"></span>
      <BlinkingCursor />
      </p>
    </div>

    <div class="note-information">
      <p class="character-count"><span ref="wordCountSpan">0</span> words</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import TitleBar from './TitleBar.vue'
import BlinkingCursor from './BlinkingCursor.vue'

const typedSpan = ref<HTMLElement | null>(null)
const wordCountSpan = ref<HTMLElement | null>(null)
let interval: number

const words = ['Ellende', 'sound', 'dark', 'dance', 'mysterious', 'edge', 'beat', 'flow']

let currentWord = ''
let currentIndex = 0
let spaceBeforeNext = false

onMounted(() => {
  interval = setInterval(() => {
    if (!typedSpan.value || !wordCountSpan.value) return

    if (currentWord === '') {
      currentWord = words[Math.floor(Math.random() * words.length)] || ''
      spaceBeforeNext = Math.random() < 0.3
      currentIndex = 0
    }

    let nextLetter = currentWord[currentIndex]
    if (currentIndex === 0 && spaceBeforeNext) {
      nextLetter = ' ' + nextLetter
    }

    typedSpan.value.textContent += nextLetter
    currentIndex++

    if (currentIndex >= currentWord.length) {
      currentWord = ''
    }

    const text = typedSpan.value.textContent ?? ''
    wordCountSpan.value.textContent =
      text.trim() === '' ? '0' : text.trim().split(/\s+/).length.toString()
  }, 75)
})

onBeforeUnmount(() => {
  clearInterval(interval)
})
</script>

<style scoped>
.drag-window {
  position: absolute;
}

.container {
  background-color: var(--background-color);
  border: var(--border-size-default) solid var(--text-color);
  width: fit-content;
  max-width: 350px;
  min-width: 200px;
  box-sizing: border-box;
  padding: var(--padding-default);
}

.container p {
  margin: 0;
  word-break: break-all;
}

.note-title {
  background-color: var(--background-color);
  border: var(--border-size-default) solid var(--text-color);
  border-bottom: none;
  padding: var(--padding-default);
}

.note-information {
  background-color: var(--background-color);
  border: var(--border-size-default) solid var(--text-color);
  border-top: none;
  padding: var(--padding-default);
}
</style>
