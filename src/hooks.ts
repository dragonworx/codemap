import { useEffect, useState, RefObject } from 'react';

export function useDOMEvent(targetOrRef: HTMLElement | RefObject<HTMLElement>, type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions | undefined) {
   useEffect(() => {
      const target: HTMLElement = 'current' in targetOrRef ? (targetOrRef as RefObject<HTMLElement>).current! : targetOrRef as HTMLElement;
      target.addEventListener(type, listener, options);
      return () => {
        target.removeEventListener(type, listener, options);
      };
     }, []);
}

export function useKeyDownEvent(listener: (e: KeyboardEvent) => void, target: HTMLElement | RefObject<HTMLElement> = document.body) {
  useDOMEvent(target, 'keydown', (e: Event) => {
    listener(e as KeyboardEvent);
  });
}

export function useKeyUpEvent(listener: (e: KeyboardEvent) => void, target: HTMLElement | RefObject<HTMLElement> = document.body) {
  useDOMEvent(target, 'keyup', (e: Event) => {
    listener(e as KeyboardEvent);
  });
}

export function useMouseDownEvent(listener: (e: MouseEvent) => void, target: HTMLElement | RefObject<HTMLElement> = document.body) {
  useDOMEvent(target, 'mousedown', (e: Event) => {
    listener(e as MouseEvent);
  });
}

export function useMouseMoveEvent(listener: (e: MouseEvent) => void, target: HTMLElement | RefObject<HTMLElement> = document.body) {
  useDOMEvent(target, 'mousemove', (e: Event) => {
    listener(e as MouseEvent);
  });
}

export function useMouseUpEvent(listener: (e: MouseEvent) => void, target: HTMLElement | RefObject<HTMLElement> = document.body) {
  useDOMEvent(target, 'mouseup', (e: Event) => {
    listener(e as MouseEvent);
  });
}

export const Keys = {
  Z: 90,
  C: 67,
  V: 86,
  N: 78,
  BACKSPACE: 8,
  DELETE: 46,
  SPACE: 32,
  ENTER: 13,
  ESC: 27,
  LEFT: 37,
  RIGHT: 39,
  UP: 38,
  DOWN: 40,
  TAB: 9,
};

// export function useForceUpdate(){
//   const [, setValue] = useState(0);
//   return () => setValue(value => ++value);
// }