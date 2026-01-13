<template>
  <MainContainer>
    <InstagramSingle>
      <div class="test-container" ref="containerRef">
        <component v-for="(item, index) in positionedComponents" :is="item.component" :key="index"
          :style="item.style" />
      </div>
    </InstagramSingle>
  </MainContainer>
</template>

<script setup lang="ts">
import { ref, onMounted, shallowRef } from 'vue';
import type { Component } from 'vue';
import MainContainer from '@/components/MainContainer.vue'
import InstagramSingle from '@/view_templates/instagram_templates/InstagramSingle.vue'
import SystemUsers from '@/components/SystemUsers.vue';
import SaferSpace from '@/components/SaferSpace.vue';

const containerRef = ref<HTMLElement | null>(null);

const components = [
  SystemUsers,
  SaferSpace,
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
      const maxLeft = container.clientWidth;
      const maxTop = container.clientHeight;
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

<style scoped>
.test-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
