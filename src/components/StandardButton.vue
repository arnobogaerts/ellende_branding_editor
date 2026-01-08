<template>
    <button class="standard-button"><p class="selected"><slot></slot></p></button>
</template>

<style scoped>
.standard-button {
  border: var(--border-size-default) solid var(--text-color);
  box-sizing: border-box;
  width: fit-content;
  background-color: var(--background-color);
  margin: 0;
  padding: var(--padding-default);
}
.standard-button:hover {
  cursor: var(--cursor-pointer);
}
.selected {
  border: 2px solid var(--text-color);
  padding: 0 5px;
  margin: 0 -3px;
}
</style>
