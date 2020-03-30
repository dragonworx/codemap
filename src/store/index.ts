import createStore from '~/store/store';
import Node from '~/node';
import { Rect } from '~/geom';
import { Command } from '~/commands/command';

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
      // new Node(new Rect(10, 10, 100, 200)), 
      // new Node(new Rect(300, 10, 150, 100)),
      // new Node(new Rect(100, 250, 200, 300)),
      new Node(new Rect(10, 10, 100, 100)), 
      new Node(new Rect(300, 10, 100, 100)),
      new Node(new Rect(100, 250, 100, 100)),
   ],
   selectedNodes: [],
} as State;

const useStore = createStore(state);

export default useStore;