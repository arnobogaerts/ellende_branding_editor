export const SAFE_MARGINS = {
  WIDTH: 10,
  HEIGHT: 30,
};

export function randomizePositions(container: HTMLElement, selectors: string = '.drag-window') {
  const windows = container.querySelectorAll<HTMLElement>(selectors);

  windows.forEach((win) => {
    const elWidth = win.offsetWidth;
    const elHeight = win.offsetHeight;

    const maxLeft = container.clientWidth - elWidth - SAFE_MARGINS.WIDTH;
    const maxTop = container.clientHeight - elHeight - SAFE_MARGINS.HEIGHT;

    const left =
      SAFE_MARGINS.WIDTH + Math.floor(Math.random() * Math.max(0, maxLeft - SAFE_MARGINS.WIDTH));
    const top =
      SAFE_MARGINS.HEIGHT + Math.floor(Math.random() * Math.max(0, maxTop - SAFE_MARGINS.HEIGHT));

    win.style.left = `${left}px`;
    win.style.top = `${top}px`;
  });
}
