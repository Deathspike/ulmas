import * as mobx from 'mobx';
import * as React from 'react';
import {core} from 'client/core';
import {GamepadManager} from 'client/core';

export class InputService {
  constructor() {
    const manager = new GamepadManager();
    document.addEventListener('keydown', x => this.onKeyDown(x));
    document.addEventListener('mousemove', x => this.onMouseMove(x));
    window.addEventListener('gamepadconnected', x => manager.connect(x.gamepad.index));
    window.addEventListener('gamepaddisconnected', x => manager.disconnect(x.gamepad.index));
    mobx.makeObservable(this);
  }

  @mobx.action
  click(handler: () => void) {
    return (ev: React.MouseEvent) => {
      handler();
      ev.preventDefault();
      ev.stopPropagation();
    };
  }

  @mobx.action
  keyDown(handler: (keyName: string) => boolean) {
    return (ev: React.KeyboardEvent) => {
      if (!core.screen.waitCount && !handler(ev.code.toLowerCase())) return;
      ev.preventDefault();
      ev.stopPropagation();
    };
  }

  @mobx.action
  keyRestore(keys = ['enter', 'space']) {
    return (ev: React.KeyboardEvent) => {
      if (!core.screen.waitCount && !keys.includes(ev.code.toLowerCase())) return;
      ev.stopPropagation();
    };
  }

  @mobx.action
  mouseRestore() {
    return (ev: React.MouseEvent) => {
      focusParent(ev.currentTarget);
      ev.preventDefault();
      ev.stopPropagation();
    };
  }
  
  @mobx.observable
  keyboardMode = false;
  
  private handleKey(keyName: string) {
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
      ? elements.filter(createFilter(current, dirX, dirY)).sort(createSorter(current, dirX))
      : elements.sort((a, b) => a.index - b.index || Math.abs(a.y) - Math.abs(b.y));
    const bestElement = validElements
      .map(x => x.element)
      .find(Boolean);
    bestElement?.focus({preventScroll: true});
    bestElement?.scrollIntoView({behavior: 'smooth', block: 'center'});
  }

  private onKeyDown(ev: KeyboardEvent) {
    this.keyboardMode = true;
    if (!core.screen.waitCount && !this.handleKey(ev.code.toLowerCase())) return;
    ev.preventDefault();
    ev.stopPropagation();
  }
  
  private onMouseMove(ev: MouseEvent) {
    this.keyboardMode = false;
    ev.preventDefault();
    ev.stopPropagation();
  }
}

function createFilter(current: ReturnType<typeof fetchBox>, dirX: number, dirY: number) {
  return (x: ReturnType<typeof fetchBox>) => {
    if (dirX < 0 && current.x - x.x <= 0) return false;
    if (dirX > 0 && current.x - x.x >= 0) return false;
    if (dirY < 0 && current.y - x.y <= 0) return false;
    if (dirY > 0 && current.y - x.y >= 0) return false;
    return true;
  };
}

function createSorter(current: ReturnType<typeof fetchBox>, dirX: number) {
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

function focusParent(element: Element | null) {
  while (element) {
    if (!element.getAttribute('tabindex')) {
      element = element.parentElement;
    } else if (element instanceof HTMLElement) {
      element.focus();
      element = element.parentElement;
    }
  }
}
