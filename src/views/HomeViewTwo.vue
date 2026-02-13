<template>
  <MainContainer>
    <InstagramSingle @randomize="handleRandomize">
      <div class="components-container" ref="containerRef">
        <component v-for="item in positionedComponents" :key="item.id" :is="item.component" v-bind="item.props"
          v-model="item.props!.modelValue" @update:modelValue="saveCurrentLayout" @drag-end="saveCurrentLayout"
          class="drag-window" />
      </div>
    </InstagramSingle>
  </MainContainer>
</template>

<script setup lang="ts">
//# region ────────────────────────────────────────────────── IMPORTS
import { ref, onMounted, nextTick } from 'vue';
import type { Component } from 'vue';
import MainContainer from '@/components/MainContainer.vue'
import InstagramSingle from '@/view_templates/instagram_templates/InstagramSingle.vue'
import TextEditor from '@/components/templates/TextEditor.vue';
import ImageViewer from '@/components/templates/ImageViewer.vue';
import { randomizePositions } from '@/directives/layout';
import CalendarIcon from '@/components/CalendarIcon.vue';
import CalendarBig from '@/components/CalendarBig.vue';
import SystemUsers from '@/components/SystemUsers.vue';
//#endregion ────────────────────────────────────────────────

//# region ────────────────────────────────────────────────── TYPES & CONFIGURATION
const containerRef = ref<HTMLElement | null>(null);

interface PositionedComponent {
  id?: string;
  component: Component;
  props?: Record<string, any>;
  content?: string;
}

const defaultComponents: PositionedComponent[] = [
  {
    component: ImageViewer,
    props: {
      image: '/public/images/berlinde.jpg',
      width: '320px',
    },
  },
  {
    component: TextEditor,
    props: {
      textEditorSize: 'subtitle',
    },
  },
  {
    component: TextEditor,
    props: {
      textEditorSize: 'subtitle',
    },
  },
  {
    component: SystemUsers,
    props: {
      width: 350
    }
  }
];

const positionedComponents = ref<PositionedComponent[]>([]);
//#endregion ────────────────────────────────────────────────

//# region ────────────────────────────────────────────────── PERSISTENCE LOGIC
const saveCurrentLayout = () => {
  if (!containerRef.value) return;
  const dataToSave: Record<string, any> = {};
  const windows = containerRef.value.querySelectorAll<HTMLElement>('.drag-window');

  windows.forEach((win, index) => {
    const comp = positionedComponents.value[index];
    if (!comp || !comp.id) return;

    dataToSave[comp.id] = {
      left: win.style.left,
      top: win.style.top,
      content: comp.props?.modelValue
    };
  });

  localStorage.setItem('instagram_layout_data', JSON.stringify(dataToSave));
};

const applySavedPositions = (savedData: Record<string, any>) => {
  if (!containerRef.value) return;
  const windows = containerRef.value.querySelectorAll<HTMLElement>('.drag-window');

  windows.forEach((win, index) => {
    const comp = positionedComponents.value[index];
    if (!comp || !comp.id) return;

    const saved = savedData[comp.id];
    if (saved) {
      win.style.left = saved.left;
      win.style.top = saved.top;
    }
  });
};
//#endregion ────────────────────────────────────────────────

//# region ────────────────────────────────────────────────── ACTIONS
const handleRandomize = () => {
  localStorage.removeItem('instagram_layout_data');

  positionedComponents.value = defaultComponents.map((c, index) => {
    const autoId = `${(c.component as any).__name || 'comp'}-${index}`;

    return {
      ...c,
      id: autoId,
      props: {
        ...JSON.parse(JSON.stringify(c.props || {})),
        modelValue: c.content
      }
    };
  });

  nextTick(() => {
    if (containerRef.value) {
      randomizePositions(containerRef.value);
      setTimeout(() => {
        saveCurrentLayout();
      }, 100);
    }
  });
};
//#endregion ────────────────────────────────────────────────

//# region ────────────────────────────────────────────────── LIFECYCLE
onMounted(async () => {
  const rawData = localStorage.getItem('instagram_layout_data');
  const savedData = rawData ? JSON.parse(rawData) : {};

  positionedComponents.value = defaultComponents.map((c, index) => {
    const autoId = `${(c.component as any).__name || 'comp'}-${index}`;

    const saved = savedData[autoId] || {};
    return {
      ...c,
      id: autoId,
      props: {
        ...c.props,
        modelValue: saved.content !== undefined ? saved.content : c.content
      }
    }
  });

  await nextTick();
  setTimeout(() => {
    if (Object.keys(savedData).length === 0) {
      if (containerRef.value) {
        randomizePositions(containerRef.value);
        saveCurrentLayout();
      }
    } else {
      applySavedPositions(savedData);
    }
  }, 60);
});
//#endregion ────────────────────────────────────────────────
</script>

<style scoped>
.components-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
