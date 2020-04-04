import { useEffect } from 'react';

export function useDomBinding(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions | undefined) {
   useEffect(() => {
      document.body.addEventListener(type, listener, options);
      return () => {
        document.body.removeEventListener(type, listener, options);
      };
     }, []);
}

export function useKeyUp(listener: (e: KeyboardEvent) => void) {
  useDomBinding('keyup', (e: Event) => {
    listener(e as KeyboardEvent);
  });
}