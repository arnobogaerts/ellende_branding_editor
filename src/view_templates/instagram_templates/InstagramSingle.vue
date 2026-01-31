<template>
  <div class="drag-window">
    <TitleBar>Instagram {{ aspectRatio }}</TitleBar>
    <div class="border-container">
      <div class="container dot-bg" ref="animatedRef" :style="{ aspectRatio: aspectRatio }">
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
  height: 75vh;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  background-color: var(--background-color);
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

// ─── Refs ───────────────────────────────────────────────────────────────────

const animatedRef = ref<HTMLElement | null>(null);
const glitchCanvas = ref<HTMLCanvasElement | null>(null);
const isRecording = ref(false);
const fontReady = ref(false);

// ─── State ──────────────────────────────────────────────────────────────────

let animationId: number | null = null;
let recorder: MediaRecorder | null = null;
let running = false;

const aspectRatio = '9/16';

const glitchConfig = {
  pixelSize: 0,
  pixelate: false,
  grayScale: false,
  rgbSeparation: true,
  rgbOffsetR: { x: -1, y: 0 },
  rgbOffsetG: { x: 0, y: 1 },
  rgbOffsetB: { x: 0, y: 0 },
  displacement: true,
  displacementAmount: 50,
  displacementFrequency: 0.2,
  colorCorruption: false,
  colorCorruptionAmount: 1,
};

// ─── Lifecycle ──────────────────────────────────────────────────────────────

onMounted(async () => {
  try {
    await document.fonts.load('1em lores-12');
  } catch {
    console.warn('Font failed to load, proceeding with fallback.');
  } finally {
    fontReady.value = true;
    startLivePreview();
  }
});

onUnmounted(() => {
  if (animationId) cancelAnimationFrame(animationId);
});

// ─── Live Preview ───────────────────────────────────────────────────────────

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

// ─── Recording ──────────────────────────────────────────────────────────────

async function startRecording() {
  const element = animatedRef.value;
  if (!element || !fontReady.value) return;

  isRecording.value = true;
  running = true;

  let previousFrame: ImageData | null = null;

  const rect = element.getBoundingClientRect();
  const targetHeight = 1920;
  const scale = targetHeight / rect.height;

  // Canvas setup
  const finalCanvas = document.createElement('canvas');
  finalCanvas.width = rect.width * scale;
  finalCanvas.height = targetHeight;
  const finalCtx = finalCanvas.getContext('2d', { willReadFrequently: true })!;

  // MediaRecorder setup
  const stream = finalCanvas.captureStream(15);
  recorder = new MediaRecorder(stream, {
    mimeType: 'video/webm;codecs=vp9',
    videoBitsPerSecond: 12000000,
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

  // Displacement glitch timing
  let lastDecisionTime = 0;
  const CHECK_INTERVAL = 1000;
  let isCurrentlyGlitching = false;
  let glitchEndTime = 0;

  async function processFrame() {
    if (!running) return;

    try {
      const dataUrl = await domtoimage.toPng(element as HTMLElement, {
        width: rect.width * scale,
        height: rect.height * scale,
        cacheBust: false,
        imagePlaceholder:
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
        style: {
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          width: rect.width + 'px',
          height: rect.height + 'px',
        },
      });

      await new Promise((resolve) => {
        const img = new Image();

        img.onload = () => {
          const now = Date.now();

          finalCtx.clearRect(0, 0, finalCanvas.width, finalCanvas.height);
          finalCtx.drawImage(img, 0, 0);

          // Phosphor trail
          if (previousFrame) {
            const current = finalCtx.getImageData(0, 0, finalCanvas.width, finalCanvas.height);
            for (let i = 0; i < current.data.length; i += 4) {
              current.data[i] = current.data[i] * 0.85 + previousFrame.data[i] * 0.15;
              current.data[i + 1] = current.data[i + 1] * 0.85 + previousFrame.data[i + 1] * 0.15;
              current.data[i + 2] = current.data[i + 2] * 0.85 + previousFrame.data[i + 2] * 0.15;
            }
            finalCtx.putImageData(current, 0, 0);
          }
          previousFrame = finalCtx.getImageData(0, 0, finalCanvas.width, finalCanvas.height);

          // RGB separation
          if (glitchConfig.rgbSeparation) {
            let imgData = finalCtx.getImageData(0, 0, finalCanvas.width, finalCanvas.height);
            imgData = runRgbSplit(imgData, scale);
            finalCtx.putImageData(imgData, 0, 0);
          }

          // Displacement glitch decision
          if (now - lastDecisionTime > CHECK_INTERVAL) {
            lastDecisionTime = now;
            if (Math.random() < glitchConfig.displacementFrequency) {
              isCurrentlyGlitching = true;
              glitchEndTime = now + 125;
            }
          }

          // Displacement glitch slices
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

          // Grain
          {
            const imageData = finalCtx.getImageData(0, 0, finalCanvas.width, finalCanvas.height);
            for (let i = 0; i < imageData.data.length; i += 4) {
              const rand = (Math.random() - 0.5) * 40;
              imageData.data[i] += rand;
              imageData.data[i + 1] += rand;
              imageData.data[i + 2] += rand;
            }
            finalCtx.putImageData(imageData, 0, 0);
          }

          // CRT flicker
          if (Math.random() < 0.08) {
            const alpha = 0.05 + Math.random() * 0.1;
            finalCtx.fillStyle = `rgba(0,0,0,${alpha})`;
            finalCtx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
          }

          // CRT post-processing
          applyVignette(finalCtx, finalCanvas.width, finalCanvas.height);
          applyScanlines(finalCtx, finalCanvas.width, finalCanvas.height);
          applyBarrelDistortion(finalCtx, finalCanvas.width, finalCanvas.height, 0.03);

          resolve(true);
        };

        img.src = dataUrl;
      });

      if (running) requestAnimationFrame(processFrame);
    } catch (e) {
      console.error('Capture failed', e);
      if (running) requestAnimationFrame(processFrame);
    }
  }

  processFrame();
}

function stopRecording() {
  running = false;
  recorder?.stop();
}

// ─── Effects ────────────────────────────────────────────────────────────────

function runRgbSplit(imageData: ImageData, scale: number): ImageData {
  const { width, height, data } = imageData;
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

function applyBarrelDistortion(ctx: CanvasRenderingContext2D, width: number, height: number, strength: number) {
  const imageData = ctx.getImageData(0, 0, width, height);
  const output = new Uint8ClampedArray(imageData.data.length);

  const cx = width / 2;
  const cy = height / 2;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const nx = (x - cx) / cx;
      const ny = (y - cy) / cy;
      const r2 = nx * nx + ny * ny;

      const distort = 1.0 + strength * r2;
      const srcX = Math.round(cx + (x - cx) * distort);
      const srcY = Math.round(cy + (y - cy) * distort);

      const destIdx = (y * width + x) * 4;
      if (srcX >= 0 && srcX < width && srcY >= 0 && srcY < height) {
        const srcIdx = (srcY * width + srcX) * 4;
        output[destIdx] = imageData.data[srcIdx];
        output[destIdx + 1] = imageData.data[srcIdx + 1];
        output[destIdx + 2] = imageData.data[srcIdx + 2];
        output[destIdx + 3] = imageData.data[srcIdx + 3];
      }
    }
  }

  ctx.putImageData(new ImageData(output, width, height), 0, 0);
}

function applyVignette(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const cx = width / 2;
  const cy = height / 2;
  const maxR = Math.sqrt(cx * cx + cy * cy);

  const gradient = ctx.createRadialGradient(cx, cy, maxR * 0.5, cx, cy, maxR);
  gradient.addColorStop(0, 'rgba(0,0,0,0)');
  gradient.addColorStop(1, 'rgba(0,0,0,0.7)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

function applyScanlines(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const spacing = 4 * (height / 1920);
  const lineH = 1 * (height / 1920);

  ctx.fillStyle = 'rgba(0,0,0,0.08)';
  for (let y = 0; y < height; y += spacing) {
    ctx.fillRect(0, y, width, lineH);
  }
}
</script>
