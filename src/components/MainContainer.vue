<template>
  <div class="main-container">
    <slot></slot>
  </div>
</template>

<style scoped>
.main-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100dvh;
  width: 100dvw;
}
</style>
