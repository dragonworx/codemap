import Node from '~/node';

export class ObjectCachedState<ObjectType, ValueType> {
   constructor (readonly object: ObjectType, readonly key: string, readonly value: ValueType) {
   }
}

export class Command {
   undoCache: ObjectCachedState<any, any>[] = [];
   redoCache: ObjectCachedState<any, any>[] = [];
   
   constructor(readonly selectedNodes: Node[]) {
   }

   do(): boolean | void {
      // false to abort
      return false;
   }

   cacheUndo<ObjectType, ValueType>(object: ObjectType, key: string, value: ValueType) {
      this.undoCache.push(new ObjectCachedState(object, key, value));
   }

   cacheRedo<ObjectType, ValueType>(object: ObjectType, key: string, value: ValueType) {
      this.redoCache.push(new ObjectCachedState(object, key, value));
   }

   undo() {
      this.undoCache.forEach(({object, key, value }) => (object as Node)[key] = value);
   }

   redo() {
      if (this.redoCache.length === 0) {
         this.do();
      } else {
         this.redoCache.forEach(({object, key, value }) => (object as Node)[key] = value);
      }
   }
}