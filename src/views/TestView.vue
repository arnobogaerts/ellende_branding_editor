<script setup lang="ts">
import { ref, onMounted, shallowRef } from 'vue';
import type { Component } from 'vue';
import CalendarBig from '@/components/CalendarBig.vue';
import CalendarIcon from '@/components/CalendarIcon.vue';
import ClockIcon from '@/components/ClockIcon.vue';
import LocationWindow from '@/components/LocationWindow.vue';
import LogoNew from '@/components/LogoNew.vue';
import SystemInformation from '@/components/SystemInformation.vue';
import SystemUsers from '@/components/SystemUsers.vue';
import TitleBig from '@/components/TitleBig.vue';
import ConsoleWindow from '@/components/ConsoleWindow.vue';
import FileCopy from '@/components/FileCopy.vue';
import TextEditorTypeGlitch from '@/components/TextEditorTypeGlitch.vue';
import PornWindow1 from '@/components/PornWindow1.vue';
import PornWindow2 from '@/components/PornWindow2.vue';
import TaskManager from '@/components/templates/TaskManager.vue';
import PornWindow3 from '@/components/PornWindow3.vue';
import VisionWindow from '@/components/VisionWindow.vue';
import SaferSpace from '@/components/SaferSpace.vue';
import TeamPicture from '@/components/TeamPicture.vue';

const containerRef = ref<HTMLElement | null>(null);

const components = [
  CalendarBig,
  SystemUsers,
  LogoNew,
  TitleBig,
  ClockIcon,
  CalendarIcon,
  LocationWindow,
  SystemInformation,
  ConsoleWindow,
  FileCopy,
  TextEditorTypeGlitch,
  PornWindow1,
  PornWindow2,
  PornWindow3,
  TaskManager,
  VisionWindow,
  SaferSpace,
  TeamPicture
];

interface PositionedComponent {
  component: Component;
  style: string;
}

const positionedComponents = shallowRef<PositionedComponent[]>([]);

onMounted(async () => {
  try {
    const container = containerRef.value;
    if (!container) return;

    positionedComponents.value = components.map((c) => {
      const maxLeft = container.clientWidth - 100;
      const maxTop = container.clientHeight - 100;
      const left = Math.floor(Math.random() * Math.max(0, maxLeft));
      const top = Math.floor(Math.random() * Math.max(0, maxTop));

      return {
        component: c,
        style: `position: absolute; left: ${left}px; top: ${top}px;`,
      };
    });
  } catch (error) {
    console.error('TestView mount error:', error);
  }
});
</script>

<template>
  <div class="test-container" ref="containerRef">
    <component v-for="(item, index) in positionedComponents" :is="item.component" :key="index" :style="item.style" />
  </div>
</template>

<style scoped>
.test-container {
  position: relative;
  width: 100vw;
  height: 100vh;
}
</style>
