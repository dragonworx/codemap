import Node from '~/node';

export class ObjectCachedState<ObjectType, ValueType> {
   constructor (readonly object: ObjectType, readonly key: string, readonly value: ValueType) {
   }
}

export class Command {
   selectedNodes: Node[];
   undoCache: ObjectCachedState<any, any>[] = [];
   redoCache: ObjectCachedState<any, any>[] = [];
   
   constructor(selectedNodes: Node[]) {
      this.selectedNodes = [...selectedNodes];
   }

   cacheUndoState<ObjectType, ValueType>(object: ObjectType, key: string, value: ValueType) {
      this.undoCache.push(new ObjectCachedState(object, key, value));
   }

   cacheRedoState<ObjectType, ValueType>(object: ObjectType, key: string, value: ValueType) {
      this.redoCache.push(new ObjectCachedState(object, key, value));
   }

   execute(): boolean | void {
      // false to abort
      return false;
   }

   undo() {
      this.undoCache.forEach(({object, key, value }) => (object as Node)[key] = value);
   }

   redo() {
      if (this.redoCache.length === 0) {
         this.execute();
      } else {
         this.redoCache.forEach(({object, key, value }) => (object as Node)[key] = value);
      }
   }
}