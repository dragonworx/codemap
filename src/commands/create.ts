import { Command } from '~/commands';
import Node from '~/node';

export class CreateNodeCommand extends Command {
   execute(nodes: Node[]) {
      const node = new Node();
      node.rect.init(10, 10, 200, 200);
      nodes.push(node);
   }
}