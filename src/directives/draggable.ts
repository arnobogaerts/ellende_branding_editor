import type { Directive } from 'vue';
import { nextTick } from 'vue';

let globalZIndex = 1000;
let activeDraggable: HTMLElement | null = null;

export const draggable: Directive<HTMLElement> = {
  async mounted(el) {
    await nextTick();

    const parent = el.parentElement;
    if (!parent) return;

    let dragging = false;
    let offsetX = 0;
    let offsetY = 0;

    el.style.position = 'absolute';
    el.style.cursor = 'var(--cursor-grab)';
    el.style.touchAction = 'none';
    el.style.userSelect = 'none';

    const allChildren = Array.from(el.querySelectorAll('*')) as HTMLElement[];

    const setDraggingState = (state: boolean) => {
      dragging = state;
      if (state) {
        if (activeDraggable && activeDraggable !== el) {
          activeDraggable.classList.remove('dragging');
        }
        el.classList.add('dragging');
        activeDraggable = el;
      } else {
        el.style.cursor = 'var(--cursor-grab)';
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      setDraggingState(true);

      const rect = el.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;

      allChildren.forEach((child) => (child.style.pointerEvents = 'none'));

      el.setPointerCapture(e.pointerId);
      el.style.cursor = 'var(--cursor-grab)';
      globalZIndex += 1;
      el.style.zIndex = String(globalZIndex);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;

      const parentRect = parent.getBoundingClientRect();
      const newX = Math.max(0, e.clientX - parentRect.left - offsetX);
      const newY = Math.max(0, e.clientY - parentRect.top - offsetY);

      el.style.left = `${newX}px`;
      el.style.top = `${newY}px`;
    };

    const onPointerUp = (e: PointerEvent) => {
      dragging = false;
      allChildren.forEach((child) => (child.style.pointerEvents = 'auto'));
      el.releasePointerCapture(e.pointerId);
      el.style.cursor = 'var(--cursor-grab)';
    };

    el.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  },
};
