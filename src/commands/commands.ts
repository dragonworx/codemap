
import useStore from '~/store';
import { Command } from '~/commands';

export function doCommand() {
   const [ state, setState ] = useStore();
   
   return (command: Command) => {
      const { undoStack, redoStack } = state;
      const abort = command.do();
      if (abort === false) {
         return;
      }
      undoStack.push(command);
      redoStack.length = 0;
      setState();
   };
};

export function undoCommand() {
   const [ state, setState ] = useStore();

   return () => {
      const { undoStack, redoStack } = state;
      const lastCommand = undoStack.pop();
      redoStack.push(lastCommand);
      lastCommand.undo();
      setState();
   };
}

export function redoCommand() {
   const [ state, setState ] = useStore();

   return () => {
      const { undoStack, redoStack } = state;
      const lastCommand = redoStack.pop();
      undoStack.push(lastCommand);
      lastCommand.redo();
      setState();
   };
}