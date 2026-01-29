<template>
  <div class="drag-window">
    <TitleBar>Instagram 3:4</TitleBar>
    <div class="border-container">
      <div class="container dot-bg" ref="animatedRef">
        <div class="container-background dot-bg"></div>
        <canvas ref="glitchCanvas" class="glitch-overlay"></canvas>
        <slot></slot>
      </div>
    </div>
    <br />
    <StandardButton @click="isRecording ? stopRecording() : startRecording()" style="margin-left: -2px;"
      :disabled="!fontReady">
      {{ !fontReady ? 'Loading Fonts...' : isRecording ? 'Stop Recording' : 'Start Recording' }}
    </StandardButton>
  </div>
</template>

<style scoped>
.border-container {
  border: var(--border-size-default) solid var(--text-color);
}

.container {
  height: 75dvh;
  box-sizing: border-box;
  aspect-ratio: 3/4;
  position: relative;
  overflow: hidden;
  background-color: #000;
}

.glitch-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1000;
}
</style>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import domtoimage from 'dom-to-image-more';
import StandardButton from '@/components/StandardButton.vue';
import TitleBar from '@/components/templates/TitleBar.vue';

const animatedRef = ref<HTMLElement | null>(null);
const glitchCanvas = ref<HTMLCanvasElement | null>(null);
const isRecording = ref(false);
const fontReady = ref(false);

let animationId: number | null = null;
let recorder: MediaRecorder | null = null;
let running = false;

const glitchConfig = {
  pixelSize: 0,
  pixelate: true,
  grayScale: false,
  rgbSeparation: true,
  rgbOffsetR: { x: -1, y: 0 },
  rgbOffsetG: { x: 0, y: 1 },
  rgbOffsetB: { x: 0, y: 0 },
  displacement: true,
  displacementAmount: 200,
  displacementFrequency: 0.1, // 10% chance per check
  colorCorruption: false,
  colorCorruptionAmount: 1,
};

onMounted(async () => {
  try {
    await document.fonts.load('1em lores-12');
  } catch {
    console.warn("Font failed to load, proceeding with fallback.");
  } finally {
    fontReady.value = true;
    startLivePreview();
  }
});

onUnmounted(() => { if (animationId) cancelAnimationFrame(animationId); });

function startLivePreview() {
  const canvas = glitchCanvas.value;
  const container = animatedRef.value;
  if (!canvas || !container) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  function animate() {
    const rect = container!.getBoundingClientRect();
    canvas!.width = rect.width;
    canvas!.height = rect.height;

    ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
    if (Math.random() < 0.1) {
      ctx!.fillStyle = 'rgba(255,255,255,0.05)';
      ctx!.fillRect(0, Math.random() * canvas!.height, canvas!.width, Math.random() * 20);
    }
    animationId = requestAnimationFrame(animate);
  }
  animate();
}

async function startRecording() {
  const element = animatedRef.value;
  if (!element || !fontReady.value) return;

  isRecording.value = true;
  running = true;

  const rect = element.getBoundingClientRect();
  const scale = 3;

  const finalCanvas = document.createElement('canvas');
  finalCanvas.width = rect.width * scale;
  finalCanvas.height = rect.height * scale;
  const finalCtx = finalCanvas.getContext('2d', { willReadFrequently: true })!;

  const stream = finalCanvas.captureStream(30);
  recorder = new MediaRecorder(stream, {
    mimeType: 'video/webm;codecs=vp9',
    videoBitsPerSecond: 12000000
  });

  const chunks: Blob[] = [];
  recorder.ondataavailable = (e) => chunks.push(e.data);
  recorder.onstop = () => {
    const blob = new Blob(chunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'glitch-fix.webm';
    a.click();
    isRecording.value = false;
  };

  recorder.start();

  // Logic control variables
  let lastDecisionTime = 0;
  const CHECK_INTERVAL = 500; // Only check for a new glitch every 1 second
  let isCurrentlyGlitching = false;
  let glitchEndTime = 0;

  async function processFrame() {
    if (!running) return;

    try {
      const dataUrl = await domtoimage.toPng(element as HTMLElement, {
        width: rect.width * scale,
        height: rect.height * scale,
        style: {
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          width: rect.width + 'px',
          height: rect.height + 'px'
        }
      });

      const img = new Image();
      img.onload = () => {
        const now = Date.now();

        // 1. FRESH START
        finalCtx.clearRect(0, 0, finalCanvas.width, finalCanvas.height);
        finalCtx.drawImage(img, 0, 0);

        // 2. RGB SPLIT (Always applied if enabled)
        if (glitchConfig.rgbSeparation) {
          let imgData = finalCtx.getImageData(0, 0, finalCanvas.width, finalCanvas.height);
          imgData = runRgbSplit(imgData, scale);
          finalCtx.putImageData(imgData, 0, 0);
        }

        // 3. DECIDE: Should we start a glitch?
        if (now - lastDecisionTime > CHECK_INTERVAL) {
          lastDecisionTime = now;
          if (Math.random() < glitchConfig.displacementFrequency) {
            isCurrentlyGlitching = true;
            glitchEndTime = now + 150; // Glitch lasts for 150ms
          }
        }

        // 4. APPLY DISPLACEMENT
        if (glitchConfig.displacement && isCurrentlyGlitching) {
          if (now > glitchEndTime) {
            isCurrentlyGlitching = false;
          } else {
            const numSlices = Math.floor(Math.random() * 3) + 1;
            for (let i = 0; i < numSlices; i++) {
              const sliceH = Math.floor(Math.random() * 50 + 20) * scale;
              const sliceY = Math.floor(Math.random() * (finalCanvas.height - sliceH));
              const shiftX = Math.round((Math.random() - 0.5) * glitchConfig.displacementAmount);

              finalCtx.drawImage(
                finalCanvas,
                0, sliceY, finalCanvas.width, sliceH,
                shiftX, sliceY, finalCanvas.width, sliceH
              );
            }
          }
        }

        if (running) requestAnimationFrame(processFrame);
      };
      img.src = dataUrl;
    } catch (e) {
      console.error("Capture failed", e);
      if (running) requestAnimationFrame(processFrame);
    }
  }

  processFrame();
}

function stopRecording() {
  running = false;
  recorder?.stop();
}

function runRgbSplit(imageData: ImageData, scale: number): ImageData {
  const { width, height, data } = imageData as ImageData;
  const out = new Uint8ClampedArray(data.length);

  const rOffX = Math.round(glitchConfig.rgbOffsetR.x * scale);
  const rOffY = Math.round(glitchConfig.rgbOffsetR.y * scale);
  const gOffX = Math.round(glitchConfig.rgbOffsetG.x * scale);
  const gOffY = Math.round(glitchConfig.rgbOffsetG.y * scale);
  const bOffX = Math.round(glitchConfig.rgbOffsetB.x * scale);
  const bOffY = Math.round(glitchConfig.rgbOffsetB.y * scale);

  for (let i = 0; i < data.length; i += 4) {
    const x = (i / 4) % width;
    const y = Math.floor((i / 4) / width);

    const rx = Math.min(Math.max(x + rOffX, 0), width - 1);
    const ry = Math.min(Math.max(y + rOffY, 0), height - 1);
    out[i] = data[(ry * width + rx) * 4];

    const gx = Math.min(Math.max(x + gOffX, 0), width - 1);
    const gy = Math.min(Math.max(y + gOffY, 0), height - 1);
    out[i + 1] = data[(gy * width + gx) * 4 + 1];

    const bx = Math.min(Math.max(x + bOffX, 0), width - 1);
    const by = Math.min(Math.max(y + bOffY, 0), height - 1);
    out[i + 2] = data[(by * width + bx) * 4 + 2];

    out[i + 3] = data[i + 3];
  }
  return new ImageData(out, width, height);
}
</script>
