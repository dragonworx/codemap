import createStore from '~/store/store';
import Node from '~/node';
import View from '~/view';
import { Command } from '~/commands/command';

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
} as State;

const useStore = createStore(state);

export default useStore;