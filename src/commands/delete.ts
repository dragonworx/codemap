import { Command } from '~/commands';
import Node from '~/node';

export class DeleteNodesCommand extends Command {
   execute(nodes: Node[], selectedNodes: Node[]) {
      const keptNodes = nodes.filter(node => selectedNodes.indexOf(node) === -1);
      this.cacheUndo(nodes, '*', [...nodes]);
      this.cacheUndo(selectedNodes, '*', [...selectedNodes]);
      nodes.length = 0;
      selectedNodes.length = 0;
      nodes.push.apply(nodes, keptNodes);
      this.cacheRedo(nodes, '*', keptNodes);
      this.cacheRedo(selectedNodes, '*', []);
   }
}