<template>
  <div class="drag-window" v-draggable="'.title-bar'">
    <TitleBar>Task Manager</TitleBar>

    <div class="container">
      <p>{{ displayTitle }}</p>
      <br />
      <ul class="task-list">
        <li v-for="(task, index) in tasks" :key="index">
          <p>
            {{ statusSymbol(task.status) }} {{ task.text }}
            <!-- Only append blinking cursor to the last task -->
            <BlinkingText v-if="index === tasks.length - 1">
              <p>_</p>
            </BlinkingText>
          </p>
          <br />
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import TitleBar from './TitleBar.vue'
import BlinkingText from './BlinkingText.vue';

type Task = {
  text: string
  status: 'completed' | 'pending' | 'deferred'
}

const props = defineProps<{
  title?: string
  tasks?: Task[]
}>()

const displayTitle = props.title || 'Title'
const tasks = props.tasks ?? [
  { text: 'Open doors for everyone', status: 'completed' },
  { text: 'Document access rules', status: 'pending' },
  { text: 'Review exclusions', status: 'deferred' }
]

// Helper to map status to symbol
function statusSymbol(status: Task['status']) {
  switch (status) {
    case 'completed':
      return '[x]'
    case 'pending':
      return '[ ]'
    case 'deferred':
      return '[-]'
    default:
      return '[?]'
  }
}
</script>

<style scoped>
.container {
  background-color: var(--background-color);
  border: var(--border-size-default) solid var(--text-color);
  width: fit-content;
  box-sizing: border-box;
  padding: 15px;
  min-width: 200px;
  max-width: 300px;
}

.task-list {
  margin: 0;
  padding: 0;
}

li {
  list-style-type: none;
}
</style>

<!--
EXAMPLE USE:
<TaskManager
  title="Ethics Tasks"
  :tasks="[
    { text: 'Open doors for everyone', status: 'completed' },
    { text: 'Document access rules', status: 'pending' },
    { text: 'Review exclusions', status: 'deferred' }
  ]"
/>-->
