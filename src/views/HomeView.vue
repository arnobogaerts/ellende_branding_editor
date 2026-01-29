<template>
  <MainContainer>
    <InstagramSingle>
      <div class="test-container" ref="containerRef">
        <component v-for="(item, index) in positionedComponents" :is="item.component" :key="index"
          v-bind="item.props" />
        <!-- REMOVED :style="item.style" -->
      </div>
    </InstagramSingle>
  </MainContainer>
</template>

<script setup lang="ts">
import { ref, onMounted, shallowRef } from 'vue';
import type { Component } from 'vue';
import MainContainer from '@/components/MainContainer.vue'
import InstagramSingle from '@/view_templates/instagram_templates/InstagramSingle.vue'
import SystemInformation from '@/components/SystemInformation.vue';
import TextEditor from '@/components/templates/TextEditor.vue';
import ImageViewer from '@/components/templates/ImageViewer.vue';

const containerRef = ref<HTMLElement | null>(null);

const components: PositionedComponent[] = [
  {
    component: SystemInformation
  },
  {
    component: TextEditor
  },
  {
    component: ImageViewer
  }
];

interface PositionedComponent {
  component: Component;
  initialLeft?: number;
  initialTop?: number;
  props?: Record<string, unknown>;
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
        component: c.component,
        props: c.props,
        initialLeft: left,
        initialTop: top,
      };
    });

    // Set positions after mount
    await new Promise(resolve => setTimeout(resolve, 0));
    const windows = container.querySelectorAll('.drag-window');
    windows.forEach((win, i) => {
      const el = win as HTMLElement;
      const comp = positionedComponents.value[i];
      if (comp && !el.style.left) {
        el.style.left = `${comp.initialLeft}px`;
        el.style.top = `${comp.initialTop}px`;
      }
    });
  } catch (error) {
    console.error('TestView mount error:', error);
  }
});
</script>

<style scoped>
.test-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
