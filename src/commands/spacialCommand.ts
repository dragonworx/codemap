import { Command } from '~/commands';
import Node from '~/node';

export class SpacialCommand extends Command {
   getMin(propKey: string, selectedNodes?: Node[]) {
      const nodes = selectedNodes || this.selectedNodes;
      let value = Number.MAX_SAFE_INTEGER;
      nodes.forEach(node => value = Math.min(node[propKey], value));
      return value;
   }

   getMax(propKey: string, selectedNodes?: Node[]) {
      const nodes = selectedNodes || this.selectedNodes;
      let value = Number.MAX_SAFE_INTEGER * -1;
      nodes.forEach(node => value = Math.max(node[propKey], value));
      return value;
   }
}