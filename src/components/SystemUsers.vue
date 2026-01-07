<script setup lang="ts">
import { onMounted, ref, nextTick } from 'vue';
import TitleBar from './TitleBar.vue';

const containerRef = ref<HTMLElement | null>(null);
const profilesRef = ref<HTMLElement | null>(null);

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
    <div class="container" ref="containerRef">
      <div class="field">
        <p>get &lt;artist&gt;*_</p>
      </div>
      <div class="field profiles" ref="profilesRef">
        <p class="profile">[profile]&lt;artist&gt;Berlinde Deman & Mirko Banovic</p>
        <p class="profile active">[profile]&lt;artist&gt;Natasha Pirard</p>
        <p class="profile">[profile]&lt;artist&gt;Ellende Crew</p>
        <p>--------------------</p>
      </div>
      <div class="field information">
        <p><b>Information:</b></p>
        <p class="information-text">
          “Natasha Pirard is a Belgian experimental electronic musician whose work blends analogue
          synthesis, tape loops, acoustic instrumentation, and voice into intimate, slowly unfolding
          compositions.”
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
  width: fit-content;
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
  padding-left: calc(var(--font-size-default) * 2);
  font-style: italic;
}
</style>
