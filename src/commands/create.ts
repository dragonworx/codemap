import { Command } from '~/commands';
import Node from '~/node';
import { replaceArray } from '~/util';

export class CreateNodeCommand extends Command {
   execute(nodes: Node[]) {
      const node = new Node();
      node.rect.init(10, 10, 200, 200);
      this.cacheUndo(nodes, '*', [...nodes]);
      nodes.push(node);
      this.cacheRedo(nodes, '*', [...nodes]);
   }
}