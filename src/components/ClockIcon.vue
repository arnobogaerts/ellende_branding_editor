<template>
  <div class="container" v-draggable :time="time">
    <img :src="ClockSrc" alt="Clock" class="svg-img-color" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import Clock1h from '@/assets/clock/clock_1h.svg'
import Clock2h from '@/assets/clock/clock_2h.svg'
import Clock3h from '@/assets/clock/clock_3h.svg'
import Clock4h from '@/assets/clock/clock_4h.svg'
import Clock5h from '@/assets/clock/clock_5h.svg'
import Clock6h from '@/assets/clock/clock_6h.svg'
import Clock7h from '@/assets/clock/clock_7h.svg'
import Clock8h from '@/assets/clock/clock_8h.svg'
import Clock9h from '@/assets/clock/clock_9h.svg'
import Clock10h from '@/assets/clock/clock_10h.svg'
import Clock11h from '@/assets/clock/clock_11h.svg'
import Clock12h from '@/assets/clock/clock_12h.svg'

const props = defineProps({
  time: {
    type: Number,
    default: 1
  }
})

const ClockSrc = computed(() => {
  const map: Record<number, string> = {
    1: Clock1h,
    2: Clock2h,
    3: Clock3h,
    4: Clock4h,
    5: Clock5h,
    6: Clock6h,
    7: Clock7h,
    8: Clock8h,
    9: Clock9h,
    10: Clock10h,
    11: Clock11h,
    12: Clock12h,
  }
  return map[props.time] || Clock1h
})
</script>

<style scoped>
.container {
  width: fit-content;
}

.container img {
  height: 100px;
  width: 100px;
}
</style>
