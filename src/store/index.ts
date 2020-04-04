import createStore from '~store/store';
import { Node, View, Point } from '~core';
import { Command } from '~commands/command';

interface State {
   undoStack: Array<Command>;
   redoStack: Array<Command>;
   nodes: Node[];
   selectedNodes: Node[];
   mode: 'select' | 'connect' | 'highlight';
   rootPath?: string;
   syntax?: string;
   theme?: string;
   view: View;
   cursor: Point;
}

const state = {
   undoStack: [],
   redoStack: [],
   nodes: [
      Node.fromRect(10, 10, 100, 100),
      // Node.fromRect(50, 120, 100, 100),
      // Node.fromRect(100, 230, 100, 100),
   ],
   syntax: 'javascript',
   theme: 'monokai',
   selectedNodes: [],
   mode: 'select',
   view: new View(),
   cursor: new Point(),
} as State;

const useStore = createStore(state);

export default useStore;