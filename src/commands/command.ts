import { Node } from '~core';
import { replaceArray } from '~/util';

export class ObjectCachedState<ObjectType, ValueType> {
   constructor (readonly object: ObjectType, readonly key: string, readonly value: ValueType) {
   }
}

export class Command {
   undoCache: ObjectCachedState<any, any>[] = [];
   redoCache: ObjectCachedState<any, any>[] = [];

   cacheUndo<ObjectType, ValueType>(object: ObjectType, key: string, value: ValueType) {
      this.undoCache.push(new ObjectCachedState(object, key, value));
   }

   cacheRedo<ObjectType, ValueType>(object: ObjectType, key: string, value: ValueType) {
      this.redoCache.push(new ObjectCachedState(object, key, value));
   }

   execute(...args:any[]): boolean | void {
      // false to abort
      return false;
   }

   undo() {
      this.undoCache.forEach(({object, key, value }) => {
         if (Array.isArray(object) && key === '*') {
            replaceArray(object, value);
         } else {
            (object as any)[key] = value;
         }
      });
   }

   redo() {
      this.redoCache.forEach(({object, key, value }) => {
         if (Array.isArray(object) && key === '*') {
            replaceArray(object, value);
         } else {
            (object as any)[key] = value;
         }
      });
   }
}