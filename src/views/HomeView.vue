<template>
  <MainContainer>
    <InstagramSingle>
      <div class="test-container" ref="containerRef">
        <component v-for="(item, index) in positionedComponents" :is="item.component" :key="index" v-bind="item.props"
          :style="{ position: 'absolute', left: item.initialLeft + 'px', top: item.initialTop + 'px' }" />
        <!-- REMOVED :style="item.style" -->
      </div>
    </InstagramSingle>
  </MainContainer>
</template>

<script setup lang="ts">
import { ref, onMounted, shallowRef, nextTick } from 'vue';
import type { Component } from 'vue';
import MainContainer from '@/components/MainContainer.vue'
import InstagramSingle from '@/view_templates/instagram_templates/InstagramSingle.vue'
import TaskManager from '@/components/templates/TaskManager.vue';
import CalendarBig from '@/components/CalendarBig.vue';
import TextEditor from '@/components/templates/TextEditor.vue';
import CalendarIcon from '@/components/CalendarIcon.vue';

const containerRef = ref<HTMLElement | null>(null);

const components: PositionedComponent[] = [
  {
    component: CalendarBig
  },
  {
    component: CalendarIcon
  },
  {
    component: TextEditor
  },
  {
    component: TaskManager,
    props: {
      title: "Villa",
      tasks: [
        { text: 'Send mails to artists', status: 'completed' },
        { text: 'Send mail to mijnLeuven', status: 'completed' },
        { text: 'Arrange scenography', status: 'pending' }
      ]
    }
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
  const container = containerRef.value;
  if (!container) return;

  positionedComponents.value = components.map(c => ({
    component: c.component,
    props: c.props,
  }));

  await nextTick();

  const windows = container.querySelectorAll<HTMLElement>('.drag-window');

  const SAFE_MARGIN_WIDTH = 10;
  const SAFE_MARGIN_HEIGHT = 30;

  windows.forEach((win, i) => {
    const comp = positionedComponents.value[i];
    if (!comp) return;

    const elWidth = win.offsetWidth;
    const elHeight = win.offsetHeight;

    const maxLeft = container.clientWidth - elWidth - SAFE_MARGIN_WIDTH;
    const maxTop = container.clientHeight - elHeight - SAFE_MARGIN_HEIGHT;

    const left = SAFE_MARGIN_WIDTH + Math.floor(Math.random() * Math.max(0, maxLeft - SAFE_MARGIN_WIDTH));
    const top = SAFE_MARGIN_HEIGHT + Math.floor(Math.random() * Math.max(0, maxTop - SAFE_MARGIN_HEIGHT));

    comp.initialLeft = left;
    comp.initialTop = top;

    win.style.left = `${left}px`;
    win.style.top = `${top}px`;
  });
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
