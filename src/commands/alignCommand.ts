import { Command } from '~/commands'

export enum Alignment {
   Near,
   Center,
   Far,
};

export class AlignCommand extends Command {
   get alignment(): Alignment {
      return Alignment.Center;
   }

   get propKey(): string {
      throw new Error('unimplemented')
   }

   getMin(propKey: string) {
      const { selectedNodes } = this;
      let value = Number.MAX_SAFE_INTEGER;
      selectedNodes.forEach(node => value = Math.min(node[propKey], value));
      return value;
   }

   getMax(propKey: string) {
      const { selectedNodes } = this;
      let value = Number.MAX_SAFE_INTEGER * -1;
      selectedNodes.forEach(node => value = Math.max(node[propKey], value));
      return value;
   }

   do() {
      const { selectedNodes } = this;
      const { alignment, propKey } = this;

      let value;
      if (alignment === Alignment.Center) {
         const left = this.getMin('left');
         const top = this.getMin('top');
         const right = this.getMax('right');
         const bottom = this.getMax('bottom');
         const midX = left + ((right - left) / 2);
         const midY = top + (bottom - top) / 2;
         const center = {
            centerX: midX,
            centerY: midY,
         };
         selectedNodes.forEach(node => {
            this.cacheUndo(node, propKey, node[propKey]);
            node[propKey] = center[propKey];
         });
      } else {
         if (alignment === Alignment.Near) {
            value = this.getMin(propKey);
         } else if (alignment === Alignment.Far) {
            value = this.getMax(propKey);
         }
         selectedNodes.forEach(node => {
            this.cacheUndo(node, propKey, node[propKey]);
            node[propKey] = value;
         });
      }
   }
}