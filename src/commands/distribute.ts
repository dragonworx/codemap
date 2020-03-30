import { SpacialCommand } from '~/commands/spacialCommand';
import Node from '~/node';

export class DistributeCommand extends SpacialCommand {
   get propKey(): string {
      throw new Error();
   }

   execute() {
      const { propKey } = this;
      const selectedNodes = [...this.selectedNodes].sort((a: Node, b: Node) => a[propKey] < b[propKey] ? -1 : a[propKey] > b[propKey] ? 1 : 0);
      const ubound = selectedNodes.length - 1;
      const min = selectedNodes[0][propKey];
      const max = selectedNodes[ubound][propKey];
      const width = max - min;
      selectedNodes.forEach((node: Node, i: number) => {
         const t = i / (ubound);
         this.cacheUndoState(node, propKey, node[propKey]);
         const value = min + (width * t);
         node[propKey] = value;
      });
   }
}

export class DistributeHorizontally extends DistributeCommand {
   get propKey(): string {
      return 'left';
   }
}

export class DistributeVertically extends DistributeCommand {
   get propKey(): string {
      return 'top';
   }
}