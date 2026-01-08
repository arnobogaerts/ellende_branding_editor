<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import type { Component } from 'vue';
import CalendarBig from '@/components/CalendarBig.vue';
import CalendarIcon from '@/components/CalendarIcon.vue';
import ClockIcon from '@/components/ClockIcon.vue';
import ImageViewer from '@/components/ImageViewer.vue';
import LocationWindow from '@/components/LocationWindow.vue';
import LogoSmall from '@/components/LogoSmall.vue';
import SystemInformation from '@/components/SystemInformation.vue';
import SystemUsers from '@/components/SystemUsers.vue';
import TitleBig from '@/components/TitleBig.vue';
import TextEditor from '@/components/TextEditor.vue';
import ConsoleWindow from '@/components/ConsoleWindow.vue';
import FileCopy from '@/components/FileCopy.vue';
import TextEditorTypeGlitch from '@/components/TextEditorTypeGlitch.vue';

const containerRef = ref<HTMLElement | null>(null);

const components = [
  CalendarBig,
  SystemUsers,
  LogoSmall,
  TitleBig,
  ClockIcon,
  CalendarIcon,
  LocationWindow,
  SystemInformation,
  ImageViewer,
  TextEditor,
  ConsoleWindow,
  FileCopy,
  TextEditorTypeGlitch
];

interface PositionedComponent {
  component: Component;
  style: string;
}

const positionedComponents = ref<PositionedComponent[]>([]);

onMounted(async () => {
  positionedComponents.value = components.map((c) => ({
    component: c,
    style: 'position: absolute; visibility: hidden;',
  }));

  await nextTick();

  const container = containerRef.value;
  if (!container) return;

  positionedComponents.value = positionedComponents.value.map((item) => {
    const el = container.querySelector(`[data-component="${item.component.name}"]`) as HTMLElement;
    const { offsetWidth: width, offsetHeight: height } = el || {
      offsetWidth: 100,
      offsetHeight: 100,
    };

    const maxLeft = container.clientWidth - width;
    const maxTop = container.clientHeight - height;

    const left = Math.floor(Math.random() * maxLeft);
    const top = Math.floor(Math.random() * maxTop);

    return {
      component: item.component,
      style: `position: absolute; left: ${left}px; top: ${top}px; visibility: visible;`,
    };
  });
});
</script>

<template>
  <div class="test-container" ref="containerRef">
    <component
      v-for="(item, index) in positionedComponents"
      :is="item.component"
      :key="index"
      :data-component="item.component.name"
      :style="item.style"
    />
  </div>
</template>

<style scoped>
.test-container {
  position: relative;
  width: 100vw;
  height: 100vh;
}
</style>
