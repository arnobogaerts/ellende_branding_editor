<template>
  <div class="drag-window" v-draggable>
    <TitleBar>Calendar</TitleBar>
    <div class="month">
      <p>FEB</p>
      <p>2026</p>
    </div>
    <div class="days">
      <p
        v-for="(day, i) in days"
        :key="i"
        :class="{ highlight: day.currentMonth && day.value === highlightDay }"
      >
        {{ day.value }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.month {
  background-color: var(--background-color);
  border: var(--border-size-default) solid var(--text-color);
  border-bottom: none;
  box-sizing: border-box;
  padding: var(--padding-default);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 40px;
  width: calc(7 * 40px + 6 * var(--border-size-default) + 4px);
}
.days {
  display: grid;
  grid-template-columns: repeat(7, 40px);
  grid-template-rows: repeat(5, 40px);
  gap: var(--border-size-default);
  background: var(--text-color);
  border: var(--border-size-default) solid var(--text-color);
  width: calc(7 * 40px + 6 * var(--border-size-default));
}
.days p {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--background-color);
}
.days p.highlight {
  background: var(--text-color);
  color: var(--background-color);
}
</style>

<script setup lang="ts">
import { computed } from 'vue';
import TitleBar from './TitleBar.vue';

interface Day {
  value: number;
  currentMonth: boolean;
}

const year = 2026;
const month = 1;
const highlightDay = 15;

const daysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
const firstWeekday = new Date(year, month, 1).getDay();

const days = computed<Day[]>(() => {
  const prevMonthDays = daysInMonth(year, month - 1);
  const currentMonthDays = daysInMonth(year, month);
  const result: Day[] = [];

  for (let i = prevMonthDays - firstWeekday + 1; i <= prevMonthDays; i++)
    result.push({ value: i, currentMonth: false });

  for (let i = 1; i <= currentMonthDays; i++) result.push({ value: i, currentMonth: true });

  let next = 1;
  while (result.length < 35) result.push({ value: next++, currentMonth: false });

  return result;
});
</script>
