<template>
  <div class="main-container">
    <div class="drag-window">
      <TitleBar>
        <StandardSelect v-model="aspectRatio" :options="[
          { value: '9/16', label: 'Instagram Story' },
          { value: '3/4', label: '3:4 Ratio' },
          { value: '4/5', label: 'Instagram Post' },
          { value: '1/1', label: '1:1 Ratio' },
          { value: '1748/2480', label: 'A5' }
        ]" />
      </TitleBar>
      <div class="border-container">
        <div v-show="aspectRatio === '9/16' && !showAspectGuide" class="aspect-guide" ref="aspecGuideRef"></div>
        <div class="container dot-bg" ref="animatedRef" :style="{ aspectRatio: aspectRatio }">
          <div class="container-background dot-bg"></div>
          <canvas ref="glitchCanvas" class="glitch-overlay"></canvas>
          <slot></slot>
        </div>
      </div>
    </div>
    <div class="buttons-container">
      <StandardButton @click="isRecording ? stopRecording() : startRecording()" style="margin-left: -2px;"
        :disabled="!fontReady">
        {{ !fontReady ? 'Loading Fonts...' : isRecording ? 'Stop Recording' : 'Start Recording' }}
      </StandardButton>
      <StandardButton @click="captureScreenshot()" :disabled="!fontReady">
        Screenshot
      </StandardButton>
      <StandardButton @click="$emit('randomize')">
        Reset
      </StandardButton>
      <StandardButton v-show="aspectRatio === '9/16'" @click="showHideAspectGuide()" :disabled="aspectRatio !== '9/16'">
        Aspect Guide
      </StandardButton>
    </div>
  </div>
</template>

<style scoped>
.main-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.border-container {
  border: var(--border-size-default) solid var(--text-color);
}

.aspect-guide {
  z-index: 9999;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: greenyellow;
  opacity: 0.25;
  pointer-events: none;
  box-sizing: border-box;
  aspect-ratio: 3 / 4;
  width: calc(75vh * 9 /16);
}

.container {
  height: 75vh;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  background-color: var(--background-color);
  border-radius: var(--crt-radius);
}

.buttons-container {
  display: flex;
  flex-direction: row;
  gap: 15px;
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
//# region ────────────────────────────────────────────────── IMPORTS
import { ref, onMounted, onUnmounted, watch } from 'vue';
import domtoimage from 'dom-to-image-more';
import StandardButton from '@/components/StandardButton.vue';
import TitleBar from '@/components/templates/TitleBar.vue';
import StandardSelect from '@/components/StandardSelect.vue';
import { SAFE_MARGINS } from '@/directives/layout';
//#endregion ────────────────────────────────────────────────

//# region ────────────────────────────────────────────────── REACTIVE UI STATE
const animatedRef = ref<HTMLElement | null>(null);
const glitchCanvas = ref<HTMLCanvasElement | null>(null);
const isRecording = ref(false);
const fontReady = ref(false);
const showAspectGuide = ref(true)
//#endregion ────────────────────────────────────────────────

//# region ────────────────────────────────────────────────── INTERAL LOGIC STATE
let animationId: number | null = null;
let recorder: MediaRecorder | null = null;
let running = false;

// Displacement glitch timing
let lastDecisionTime = 0;
const CHECK_INTERVAL = 1000;
let isCurrentlyGlitching = false;
let glitchEndTime = 0;
//#endregion ────────────────────────────────────────────────

//# region ────────────────────────────────────────────────── UTILITIES
function getTargetHeight(aspectRatio: string | undefined) {
  switch (aspectRatio) {
    case '3/4': return 1440;
    case '9/16': return 1920;
    case '1/1': return 1080;
    case '4/5': return 1350;
    case '1748/2480': return 2480;
    default: return 1920;
  }
}

function showHideAspectGuide() {
  showAspectGuide.value = !showAspectGuide.value
}
//#endregion ────────────────────────────────────────────────

//# region ────────────────────────────────────────────────── CONFIGURATION
const glitchConfig = {
  displacement: true,
  displacementAmount: 50,
  displacementFrequency: 0.2,

  rgbOffset: true,
  rgbOffsetR: { x: -1, y: 0 },
  rgbOffsetG: { x: 0, y: 1 },
  rgbOffsetB: { x: 0, y: 0 },

  crtBorders: true,
  crtBordersAmount: 0.01,

  crtFlicker: true,
  ctrFlickerFrequency: 0.08,
  ctrFlickerDimness: 0.05,
  ctrFlickerRandomize: 0.1,

  grain: true,
  grainAmount: 40,
};
//#endregion ────────────────────────────────────────────────

//# region ────────────────────────────────────────────────── COMPONENT INTERFACE
const safeMargins = {
  x: SAFE_MARGINS.WIDTH,
  y: SAFE_MARGINS.HEIGHT
};

defineExpose({ safeMargins });
//#endregion ────────────────────────────────────────────────


//# region ────────────────────────────────────────────────── LIFECYCLE & WATCHERS
onMounted(async () => {
  try {
    await document.fonts.load('1em lores-12');
  } catch {
    console.warn('Font failed to load, proceeding with fallback.');
  } finally {
    fontReady.value = true;
    applyCrtBorders();
    startLivePreview();
  }
});

onUnmounted(() => {
  if (animationId) cancelAnimationFrame(animationId);
});

const savedRatio = localStorage.getItem('instagram_aspect_ratio');
const aspectRatio = ref<string>(savedRatio || '9/16');
watch(aspectRatio, (newRatio) => {
  localStorage.setItem('instagram_aspect_ratio', newRatio);
  applyCrtBorders();
});
//#endregion ────────────────────────────────────────────────


//# region ────────────────────────────────────────────────── LIVE PREVIEW
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
//#endregion ────────────────────────────────────────────────

//# region ────────────────────────────────────────────────── RECORDING
async function startRecording() {
  const element = animatedRef.value;
  if (!element || !fontReady.value) return;

  isRecording.value = true;
  running = true;

  let previousFrame: ImageData | null = null;

  const rect = element.getBoundingClientRect();

  const targetHeight = getTargetHeight(aspectRatio.value);

  const scale = targetHeight / rect.height;

  const finalCanvas = document.createElement('canvas');
  finalCanvas.width = rect.width * scale;
  finalCanvas.height = targetHeight;
  const finalCtx = finalCanvas.getContext('2d', { willReadFrequently: true })!;

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

          finalCtx.clearRect(0, 0, finalCanvas.width, finalCanvas.height);
          finalCtx.drawImage(img, 0, 0);

          // Phosphor trail
          const PHOSPHOR_VALUE_ONE = 0.88
          const PHOSPHOR_VALUE_TWO = 0.2
          if (previousFrame) {
            const current = finalCtx.getImageData(0, 0, finalCanvas.width, finalCanvas.height);
            for (let i = 0; i < current.data.length; i += 4) {
              current.data[i] = current.data[i] * PHOSPHOR_VALUE_ONE + previousFrame.data[i] * PHOSPHOR_VALUE_TWO;
              current.data[i + 1] = current.data[i + 1] * PHOSPHOR_VALUE_ONE + previousFrame.data[i + 1] * PHOSPHOR_VALUE_TWO;
              current.data[i + 2] = current.data[i + 2] * PHOSPHOR_VALUE_ONE + previousFrame.data[i + 2] * PHOSPHOR_VALUE_TWO;
            }
            finalCtx.putImageData(current, 0, 0);
          }
          previousFrame = finalCtx.getImageData(0, 0, finalCanvas.width, finalCanvas.height);

          applyAllEffects(finalCtx, finalCanvas, scale);

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
//#endregion ────────────────────────────────────────────────

//# region ────────────────────────────────────────────────── SCREENSHOT
async function captureScreenshot() {
  const element = animatedRef.value;
  if (!element || !fontReady.value) return;

  const rect = element.getBoundingClientRect();
  const targetHeight = getTargetHeight(aspectRatio.value);
  const scale = targetHeight / rect.height;

  try {
    // 1. Capture the DOM element as a PNG
    const dataUrl = await domtoimage.toPng(element, {
      width: rect.width * scale,
      height: targetHeight,
      style: {
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        width: rect.width + 'px',
        height: rect.height + 'px',
      },
    });

    // 2. Process through the effects pipeline
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = rect.width * scale;
    tempCanvas.height = targetHeight;
    const tempCtx = tempCanvas.getContext('2d')!;

    const img = new Image();
    img.onload = () => {
      tempCtx.drawImage(img, 0, 0);

      applyAllEffectsScreenshot(tempCtx, tempCanvas, scale);

      // 3. Trigger Download
      const link = document.createElement('a');
      link.download = `glitch-capture-${Date.now()}.png`;
      link.href = tempCanvas.toDataURL('image/png');
      link.click();
    };
    img.src = dataUrl;
  } catch (e) {
    console.error('Screenshot failed', e);
  }
}
//#endregion ────────────────────────────────────────────────

//# region ────────────────────────────────────────────────── EFFECTS
function applyAllEffects(targetCtx: CanvasRenderingContext2D, targetCanvas: HTMLCanvasElement, currentScale: number) {
  const now = Date.now();
  const { width, height } = targetCanvas;

  applyRgbOffset(targetCtx, targetCanvas, currentScale);
  applyDisplacement(now, currentScale, targetCtx, targetCanvas);
  applyGrain(targetCtx, width, height);
  applyCrtFlicker(targetCtx, width, height);
  applyVignette(targetCtx, width, height);
  applyScanlines(targetCtx, width, height);
  applyBarrelDistortion(targetCtx, width, height, 0.05);
}

function applyAllEffectsScreenshot(targetCtx: CanvasRenderingContext2D, targetCanvas: HTMLCanvasElement, currentScale: number) {
  const now = Date.now();
  const { width, height } = targetCanvas;

  applyRgbOffset(targetCtx, targetCanvas, currentScale);
  applyDisplacement(now, currentScale, targetCtx, targetCanvas);
  applyGrain(targetCtx, width, height);
  applyVignette(targetCtx, width, height);
  applyScanlines(targetCtx, width, height);
  applyBarrelDistortion(targetCtx, width, height, 0.05);
}

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

function applyRgbOffset(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, scale: number) {
  if (glitchConfig.rgbOffset) {
    let imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    imgData = runRgbSplit(imgData, scale);
    ctx.putImageData(imgData, 0, 0);
  }
}

function applyDisplacement(now: number, scale: number, ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
  if (now - lastDecisionTime > CHECK_INTERVAL) {
    lastDecisionTime = now;
    if (Math.random() < glitchConfig.displacementFrequency) {
      isCurrentlyGlitching = true;
      glitchEndTime = now + 125;
    }
  }

  if (glitchConfig.displacement && isCurrentlyGlitching) {
    if (now > glitchEndTime) {
      isCurrentlyGlitching = false;
    } else {
      const numSlices = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < numSlices; i++) {
        const sliceH = Math.floor(Math.random() * 50 + 20) * scale;
        const sliceY = Math.floor(Math.random() * (canvas.height - sliceH));
        const shiftX = Math.round((Math.random() - 0.5) * glitchConfig.displacementAmount);

        ctx.drawImage(
          canvas,
          0, sliceY, canvas.width, sliceH,
          shiftX, sliceY, canvas.width, sliceH
        );
      }
    }
  }
}

function applyGrain(ctx: CanvasRenderingContext2D, width: number, height: number) {
  if (glitchConfig.grain) {
    const imageData = ctx.getImageData(0, 0, width, height);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const rand = (Math.random() - 0.5) * glitchConfig.grainAmount;
      data[i] += rand;     // Red
      data[i + 1] += rand; // Green
      data[i + 2] += rand; // Blue
    }

    ctx.putImageData(imageData, 0, 0);

  }
}

function applyCrtFlicker(ctx: CanvasRenderingContext2D, width: number, height: number) {
  if (Math.random() < glitchConfig.ctrFlickerFrequency && glitchConfig.crtFlicker) {
    const alpha = glitchConfig.ctrFlickerDimness + Math.random() * glitchConfig.ctrFlickerRandomize;
    ctx.fillStyle = `rgba(0,0,0,${alpha})`;
    ctx.fillRect(0, 0, width, height);
  }
}

function applyCrtBorders() {
  if (glitchConfig.crtBorders) {
    const element = animatedRef.value;
    if (!element) return;
    const targetHeight = getTargetHeight(aspectRatio.value);
    const CRT_RADIUS_FACTOR = glitchConfig.crtBordersAmount;
    const crtRadiusPx = Math.round(targetHeight * CRT_RADIUS_FACTOR);
    element.style.setProperty('--crt-radius', `${crtRadiusPx}px`);
  }
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
//#endregion ────────────────────────────────────────────────
</script>
