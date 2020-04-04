import { Command } from '~commands';
import { Node } from '~core';
import { replaceArray } from '~util';

export class DeleteNodesCommand extends Command {
   execute(nodes: Node[], selectedNodes: Node[]) {
      const keptNodes = nodes.filter(node => selectedNodes.indexOf(node) === -1);
      this.cacheUndo(nodes, '*', [...nodes]);
      this.cacheUndo(selectedNodes, '*', [...selectedNodes]);
      replaceArray(nodes, keptNodes);
      replaceArray(selectedNodes, []);
      this.cacheRedo(nodes, '*', keptNodes);
      this.cacheRedo(selectedNodes, '*', []);
   }
}