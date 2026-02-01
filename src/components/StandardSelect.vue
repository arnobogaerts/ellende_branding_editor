<template>
  <div class="standard-select" :value="modelValue" @change="onChange" @click="toggle">
    <div class="selected">{{ selectedLabel }} &#9662;</div>
    <div class="standard-select-options-container" v-show="open">
      <div class="standard-select-options" v-for="(option, index) in options" :key="index" :value="option?.value"
        @click.stop="select(option)">
        {{ option?.label }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.standard-select {
  display: inline-block;
  position: relative;
  appearance: none;
  background-color: var(--background-color);
}

.standard-select:hover {
  cursor: var(--cursor-select) !important;
}

.standard-select-options-container {
  position: absolute;
  top: calc(100% + 2px);
  width: fit-content;
  width: fit-content;
  background-color: var(--background-color);
  z-index: 9999;
  max-height: 200px;
  overflow-y: auto;
  border: var(--border-size-default) solid var(--text-color);
  left: -7px;
}

.standard-select-options {
  z-index: 9999;
  color: var(--text-color);
  padding: var(--padding-default);
}

.standard-select-options:hover {
  background-color: var(--text-color);
  color: var(--background-color);
}
</style>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface SelectOption {
  value: string | number
  label: string
}

const props = defineProps<{
  options: SelectOption[],
  modelValue: string | number
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string | number]
}>()

function onChange(e: Event) {
  emit('update:modelValue', (e.target as HTMLSelectElement).value)
}

const open = ref(false)

const selectedLabel = computed(() => {
  const found = props.options.find(o => o.value === props.modelValue)
  return found ? found.label : 'Select...'
})

function toggle() {
  open.value = !open.value
}

function select(option: SelectOption) {
  emit('update:modelValue', option.value)
  open.value = false
}
</script>
