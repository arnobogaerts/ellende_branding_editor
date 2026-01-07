<template>
  <div class="container" v-draggable>
    <h2>FEB</h2>
    <h2>15</h2>
  </div>
</template>

<style scoped>
.container {
  background-color: var(--background-color);
  width: 100px;
  height: 100px;
  border: var(--border-size-default) solid var(--text-color);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
