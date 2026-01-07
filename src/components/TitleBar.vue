<template>
  <div class="title title-bar">
    <p><slot></slot></p>
  </div>
</template>

<style>
.title {
  border: var(--border-size-default) solid var(--text-color);
  border-bottom: none;
  box-sizing: border-box;
  padding: var(--padding-default);
  width: fit-content;
  background-color: var(--background-color);
}
</style>
