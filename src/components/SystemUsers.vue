<script setup lang="ts">
import { onMounted, ref, nextTick } from 'vue';
import TitleBar from './templates/TitleBar.vue';
import BlinkingText from './templates/BlinkingText.vue';

const containerRef = ref<HTMLElement | null>(null);
const profilesRef = ref<HTMLElement | null>(null);

const props = withDefaults(
  defineProps<{
    width?: number
  }>(),
  {
    width: 300
  }
)

onMounted(async () => {
  await nextTick();
  if (containerRef.value && profilesRef.value) {
    containerRef.value.style.width = `${profilesRef.value.offsetWidth}px`;
  }
});
</script>

<template>
  <div class="drag-window" v-draggable>
    <TitleBar>System Users</TitleBar>
    <div class="container" ref="containerRef" :style="{ width: props.width + 'px' }">
      <div class="field">
        <p>get &lt;artist&gt;*
          <BlinkingText>_</BlinkingText>
        </p>
      </div>
      <div class="field profiles" ref="profilesRef">
        <p class="profile active">[profile]&lt;artist&gt;Berlinde Deman</p>
        <p class="profile">[profile]&lt;artist&gt;Pastige</p>
        <p class="profile">[profile]&lt;artist&gt;Echo/Dawn</p>
        <p>--------------------</p>
      </div>
      <div class="field information">
        <p><b>Information:</b></p>
        <p class="information-text">
          “Berlinde Deman plays the serpent, a rare wind instrument from the sixteenth century, with a sound from a
          world without electricity, without engines, and without constant stimuli, shaped by a different relationship
          to silence and time. This historical sound material is not presented as a museum object, but brought into
          dialogue with contemporary sounds and effects.”
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  background-color: var(--background-color);
  border: var(--border-size-default) solid var(--text-color);
}

.field {
  border-bottom: var(--border-size-default) solid var(--text-color);
  box-sizing: border-box;
  padding: var(--padding-default);
}

.profiles {
  white-space: nowrap;
}

.profile:hover {
  background-color: var(--text-color);
  color: var(--background-color);
  cursor: var(--cursor-pointer);
}

.profile.active {
  background-color: var(--text-color);
  color: var(--background-color);
}

.information {
  border-bottom: none;
}

.information-text {
  font-style: italic;
}
</style>
