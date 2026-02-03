import type { Directive } from 'vue';
import { nextTick } from 'vue';
import { SAFE_MARGINS } from '@/directives/layout';

let activeWindow: HTMLElement | null = null;
const positions = new WeakMap<HTMLElement, { left: string; top: string }>();
let highestZIndex = 1000;

export const draggable: Directive<HTMLElement, string> = {
  async mounted(el, binding) {
    await nextTick();

    const parent = el.offsetParent as HTMLElement | null;
    if (!parent) return;

    const handle = binding.value ? el.querySelector<HTMLElement>(binding.value) : el;
    if (!handle) {
      console.warn('v-draggable: handle not found:', binding.value);
      return;
    }

    let dragging = false;
    let offsetX = 0;
    let offsetY = 0;

    el.style.position = 'absolute';

    if (!el.style.zIndex) {
      el.style.zIndex = String(highestZIndex++);
    }

    const savedPos = positions.get(el);
    if (savedPos) {
      el.style.left = savedPos.left;
      el.style.top = savedPos.top;
    } else {
      positions.set(el, { left: el.style.left, top: el.style.top });
    }

    handle.classList.add('grab');
    handle.style.userSelect = 'none';
    handle.style.touchAction = 'none';

    const setActiveWindow = () => {
      if (activeWindow && activeWindow !== el) {
        activeWindow.classList.remove('active');
      }
      activeWindow = el;
      el.classList.add('active');
      el.style.zIndex = String(++highestZIndex);
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      if (e.target !== handle && !handle.contains(e.target as Node)) return;

      dragging = true;
      el.classList.add('dragging');
      setActiveWindow();

      const rect = el.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;

      handle.setPointerCapture(e.pointerId);
      handle.classList.remove('grab');
      handle.classList.add('grabbing');
    };

    function clamp(value: number, min: number, max: number) {
      return Math.min(Math.max(value, min), max);
    }

    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;

      const parentRect = parent.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();

      let nextLeft = e.clientX - parentRect.left - offsetX;
      let nextTop = e.clientY - parentRect.top - offsetY;

      const maxLeft = parentRect.width - elRect.width - SAFE_MARGINS.WIDTH;
      const maxTop = parentRect.height - elRect.height - SAFE_MARGINS.HEIGHT;

      nextLeft = clamp(nextLeft, SAFE_MARGINS.WIDTH, maxLeft);
      nextTop = clamp(nextTop, SAFE_MARGINS.HEIGHT, maxTop);

      el.style.left = `${nextLeft}px`;
      el.style.top = `${nextTop}px`;

      positions.set(el, {
        left: el.style.left,
        top: el.style.top,
      });
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!dragging) return;
      dragging = false;
      el.classList.remove('dragging');
      handle.releasePointerCapture(e.pointerId);
      handle.classList.remove('grabbing');
      handle.classList.add('grab');
      el.dispatchEvent(new CustomEvent('drag-end'));
    };

    el.addEventListener('mousedown', setActiveWindow);
    handle.addEventListener('pointerdown', onPointerDown);
    handle.addEventListener('pointermove', onPointerMove);
    handle.addEventListener('pointerup', onPointerUp);
  },
};
