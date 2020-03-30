import { Command } from '~/commands';
import Node from '~/node';

export class MoveNodeCommand extends Command {
   execute() {
      const { selectedNodes } = this;

      const movedNodes = selectedNodes.filter((node: Node) => !node.location.equals(node.dragStart));
      
      if (movedNodes.length === 0) {
         return false;
      }

      movedNodes.forEach((node: Node) => {
         this.cacheUndoState(node, 'location', node.dragStart);
         this.cacheRedoState(node, 'location', node.dragEnd);
      });
   }
}