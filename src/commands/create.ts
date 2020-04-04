import { Command } from '~commands';
import { Node, Point, NodeState } from '~core';
import { replaceArray } from '~util';

export class CreateNodeCommand extends Command {
   execute(nodes: Node[], selectedNodes: Node[], cursor: Point) {
      const node = new Node();
      node.rect.init(cursor.x, cursor.y, 0, 0);
      this.cacheUndo(nodes, '*', [...nodes]);
      nodes.push(node);
      replaceArray(selectedNodes, [node]);
      this.cacheRedo(nodes, '*', [...nodes]);
   }
}