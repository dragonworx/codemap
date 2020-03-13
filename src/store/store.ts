import { useState, useEffect } from 'react';

type Setter = React.Dispatch<React.SetStateAction<undefined>>;

export default function createStore<T>(initialState: T) {
   let listeners = Array<Setter>();
   let state = {
      ...initialState
   };

   const setState = (newState?: Partial<T>) => {
      state = {
         ...state,
         ...newState
      };

      listeners.forEach((listener) => {
         listener(state as any);
      });
   };

   const useStore = ():[T, (newState?: Partial<T>) => void] => {
      const newListener: Setter = useState()[1];

      useEffect(() => {
         listeners.push(newListener);
         return () => {
            listeners = listeners.filter(listener => listener !== newListener);
          };
      }, []);
      
      return [state, setState];
   };

   return useStore;
}