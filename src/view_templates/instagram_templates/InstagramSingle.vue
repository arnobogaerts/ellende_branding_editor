<template>
  <div class="drag-window">
    <TitleBar>Instagram 3:4</TitleBar>
    <div class="container dot-bg" ref="animatedRef">
      <div class="container-background dot-bg"></div>
      <slot></slot>
    </div>
    <br />
    <StandardButton @click="startRecording" style="margin-left: -2px;">Start Recording</StandardButton>
  </div>
</template>

<style scoped>
.container {
  height: 75dvh;
  box-sizing: border-box;
  aspect-ratio: 3/4;
  border: var(--border-size-default) solid var(--text-color);
  position: relative;
}
</style>

<script setup lang="ts">
import { ref } from 'vue';
import html2canvas from 'html2canvas';
import StandardButton from '@/components/StandardButton.vue';
import TitleBar from '@/components/templates/TitleBar.vue';
const animatedRef = ref<HTMLElement | null>(null);
async function startRecording(): Promise<void> {
  const element = animatedRef.value;
  if (!element) {
    console.error('Element is null');
    return;
  }

  console.log('Starting recording...');

  const rect = element.getBoundingClientRect();
  const scale = 3;

  const canvas = document.createElement('canvas');
  canvas.width = rect.width * scale;
  canvas.height = rect.height * scale;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.error('2D context not available');
    return;
  }

  const stream = canvas.captureStream(30);
  const mimeType = 'video/webm;codecs=vp9';
  const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 16000000 });
  const chunks: Blob[] = [];

  recorder.ondataavailable = (event: BlobEvent) => {
    if (event.data.size > 0) chunks.push(event.data);
  };

  recorder.start(100);
  console.log('MediaRecorder started');

  let running = true;
  let frameCount = 0;

  async function drawFrame() {
    if (!running) return;

    const frameCanvas = await html2canvas(element as HTMLElement, {
      logging: false,
      scale,
      width: rect.width,
      height: rect.height,
      allowTaint: true,
      useCORS: true,
      foreignObjectRendering: false,
    });

    ctx?.clearRect(0, 0, canvas.width, canvas.height);
    ctx?.drawImage(frameCanvas, 0, 0);

    frameCount++;
    requestAnimationFrame(drawFrame);
  }

  drawFrame();

  setTimeout(() => {
    running = false;
    recorder.stop();
    console.log('Stopping recorder, frames rendered:', frameCount);
  }, 5000);

  recorder.onstop = () => {
    console.log('Recorder stopped, total chunks:', chunks.length);

    const blob = new Blob(chunks, { type: mimeType });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'recording.webm';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setTimeout(() => URL.revokeObjectURL(url), 100);

    console.log('Download complete: recording.webm');
  };
}
</script>
