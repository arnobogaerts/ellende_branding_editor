<template>
  <div class="drag-window" v-draggable="'.title-bar'">
    <TitleBar>System Information</TitleBar>
    <div class="container">
      <div class="information">
        <p><b>----- Ellende OS 1.1 -----</b></p>
        <p>Nodename: leuven-3000-be</p>
        <p>Kernel: 14.12.24-el-smp</p>
        <p>Uptime: {{ uptime }}</p>
        <p>inet6 addr: 3000::be/64 Scope:Global</p>
      </div>
      <div class="copyright">
        <p>© 2024-{{ currentYear }} Ellende. All rights reserved.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import TitleBar from './templates/TitleBar.vue';
import { ref, computed, onMounted, onUnmounted } from 'vue';

const currentYear = new Date().getFullYear();

const startDate = new Date('2024-12-14T23:00:00');
const now = ref(new Date());

const uptime = computed(() => {
  const diffMs = now.value.getTime() - startDate.getTime();

  const totalSeconds = Math.floor(diffMs / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalDays = Math.floor(totalHours / 24);

  const hh = (totalHours % 24).toString().padStart(2, '0');
  const mm = (totalMinutes % 60).toString().padStart(2, '0');
  const ss = (totalSeconds % 60).toString().padStart(2, '0');

  return `${totalDays} days, ${hh}:${mm}:${ss}`;
});

let timer: ReturnType<typeof setInterval>;
onMounted(() => {
  timer = setInterval(() => {
    now.value = new Date();
  }, 1000);
});

onUnmounted(() => {
  clearInterval(timer);
});
</script>

<style scoped>
.container {
  background-color: var(--background-color);
  border: var(--border-size-default) solid var(--text-color);
  width: 350px;
}

.information {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.copyright {
  border-top: var(--border-size-default) solid var(--text-color);
  display: flex;
  flex-direction: row;
  justify-content: center;
}
</style>
