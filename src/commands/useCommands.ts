
import useStore from '~/store';
import { Command } from '~/commands';

export function useCommands() {
   const [ state, setState ] = useStore();

   const execute = (command: Command) => {
      const { undoStack, redoStack } = state;
      const abort = command.execute();
      if (abort === false) {
         return;
      }
      undoStack.push(command);
      redoStack.length = 0;
      setState();
   };

   const undo = () => {
      const { undoStack, redoStack } = state;
      const lastCommand = undoStack.pop();
      redoStack.push(lastCommand);
      lastCommand.undo();
      setState();
   };

   const redo = () => {
      const { undoStack, redoStack } = state;
      const lastCommand = redoStack.pop();
      undoStack.push(lastCommand);
      lastCommand.redo();
      setState();
   };

   return {
      execute,
      undo,
      redo,
   };
}