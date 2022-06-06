import * as React from 'react';

export class InputService {
  constructor() {
    document.addEventListener('keydown', ev => {
      if (!this.onDocumentKey(ev.code.toLowerCase())) return;
      ev.preventDefault();
      ev.stopPropagation();
    });
  }

  click(handler: () => void) {
    return (ev: React.MouseEvent) => {
      handler();
      ev.preventDefault();
      ev.stopPropagation();
    };
  }

  keyDown(handler: (keyName: string) => boolean) {
    return (ev: React.KeyboardEvent) => {
      if (!handler(ev.code.toLowerCase())) return;
      ev.preventDefault();
      ev.stopPropagation();
    };
  }

  keyRestore() {
    const keys = ['enter', 'space'];
    return (ev: React.KeyboardEvent) => {
      if (!keys.includes(ev.code.toLowerCase())) return;
      ev.stopPropagation();
    };
  }
  
  private onDocumentKey(keyName: string) {
    switch (keyName) {
      case 'arrowleft':
        this.handleNavigation(-1, 0);
        return true;
      case 'arrowright':
        this.handleNavigation(1, 0);
        return true;
      case 'arrowdown':
        this.handleNavigation(0, 1);
        return true;
      case 'arrowup':
        this.handleNavigation(0, -1);
        return true;
      default:
        return false;
    }
  }

  private handleNavigation(dirX: number, dirY: number) {
    const current = document.activeElement && document.activeElement !== document.body
      ? fetchBox(document.activeElement)
      : undefined;
    const elements = Array.from(document.querySelectorAll<HTMLElement>('*[tabIndex]'))
      .map(fetchBox)
      .filter(x => x.index >= 0);
    const validElements = current && current.index >= 0
      ? elements.filter(createFilter(dirX, dirY, current)).sort(createSorter(dirX, current))
      : elements.sort((a, b) => a.index - b.index);
    const bestElement = validElements
      .map(x => x.element)
      .find(Boolean);
    bestElement?.focus({preventScroll: true});
    bestElement?.scrollIntoView({behavior: 'smooth', block: 'center'});
  }
}

function createFilter(dirX: number, dirY: number, current: ReturnType<typeof fetchBox>) {
  return (x: ReturnType<typeof fetchBox>) => {
    if (dirX < 0 && current.x - x.x <= 0) return false;
    if (dirX > 0 && current.x - x.x >= 0) return false;
    if (dirY < 0 && current.y - x.y <= 0) return false;
    if (dirY > 0 && current.y - x.y >= 0) return false;
    return true;
  };
}

function createSorter(dirX: number, current: ReturnType<typeof fetchBox>) {
  return (a: ReturnType<typeof fetchBox>, b: ReturnType<typeof fetchBox>) => {
    const ax = Math.abs(current.x - a.x);
    const ay = Math.abs(current.y - a.y);
    const bx = Math.abs(current.x - b.x);
    const by = Math.abs(current.y - b.y);
    return dirX ? ay - by || ax - bx : ax - bx || ay - by;
  };
}

function fetchBox<T extends Element>(element: T) {
  const rect = element.getBoundingClientRect();
  const index = Number(element.getAttribute('tabindex'));
  const x = rect.x;
  const y = rect.y + rect.height / 2;
  return {element, index, x, y};
}
