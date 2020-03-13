
import { useStore, Command } from '~/store';

export function doCommand() {
   const [ state, setState ] = useStore();
   
   return (command: Command) => {
      const { undoStack, redoStack } = state;
      undoStack.push(command);
      redoStack.length = 0;
      command.do();
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
      lastCommand.do();
      setState();
   };
}