
import useStore from '~/store';
import { Command } from '~/commands';

export function useCommands() {
   const [ state, setState ] = useStore();

   const execute = (command: Command, ...args:any[]) => {
      const { undoStack, redoStack } = state;
      const abort = command.execute(...args);
      const array = [...args];
      if (abort === false) {
         return;
      }
      console.log(command, array);
      undoStack.push(command);
      redoStack.length = 0;
      setState();
   };

   const undo = () => {
      const { undoStack, redoStack } = state;
      const lastCommand = undoStack.pop();
      if (lastCommand) {
         redoStack.push(lastCommand);
         lastCommand.undo();
         setState();
      }
   };

   const redo = () => {
      const { undoStack, redoStack } = state;
      const lastCommand = redoStack.pop();
      if (lastCommand) {
         undoStack.push(lastCommand);
         lastCommand.redo();
         setState();
      }
   };

   return {
      execute,
      undo,
      redo,
   };
}