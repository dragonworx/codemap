import createStore from '~/store/store';
import Node from '~/node';
import { Rect } from '~/geom';

class ObjectState<ObjectType, ValueType> {
   constructor (readonly object: ObjectType, readonly key: string, readonly value: ValueType) {
   }
}

class Command {
   state: ObjectState<any, any>[] = [];
   
   constructor(readonly selectedNodes: Node[]) {

   }

   do() {
      throw new Error('umimplemented');
   }

   undo() {
      this.state.forEach(({object, key, value}) => (object as Node)[key] = value);
   }
}

interface State {
   undoStack: Array<Command>;
   redoStack: Array<Command>;
   nodes: Node[];
   selectedNodes: Node[];
}

const state = {
   undoStack: [],
   redoStack: [],
   nodes: [
   new Node(new Rect(10, 10, 100, 200)), 
   new Node(new Rect(300, 10, 150, 100)),
   new Node(new Rect(100, 250, 200, 300)),
],
   selectedNodes: [],
} as State;

const useStore = createStore(state);

export {
   useStore,
   Command,
   ObjectState,
};

// export class Document {
//    nodes: Node[] = [];
//    selectedNodes: Node[] = [];
   
//    isSelected(node: Node) {
//       return !!this.selectedNodes.find((selectedNode: Node) => selectedNode === node);
//    }

//    addNodes(nodes: Node[]) {
//       this.nodes.push.apply(this.nodes, nodes);
//    }
// }