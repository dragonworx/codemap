import { SpacialCommand } from '~/commands/spacialCommand';

export enum Alignment {
   Near,
   Center,
   Far,
};

export class AlignCommand extends SpacialCommand {
   get alignment(): Alignment {
      return Alignment.Center;
   }

   get propKey(): string {
      throw new Error('unimplemented')
   }
   execute() {
      const { selectedNodes } = this;
      const { alignment, propKey } = this;

      let value: number;

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
            this.cacheUndoState(node, propKey, node[propKey]);
            node[propKey] = center[propKey];
         });
      } else {
         if (alignment === Alignment.Near) {
            value = this.getMin(propKey);
         } else if (alignment === Alignment.Far) {
            value = this.getMax(propKey);
         }
         selectedNodes.forEach(node => {
            this.cacheUndoState(node, propKey, node[propKey]);
            node[propKey] = value;
         });
      }
   }
}

export class AlignHCenterCommand extends AlignCommand {
   get alignment() {
      return Alignment.Center;
   }

   get propKey() {
      return 'centerX';
   }
}

export class AlignLeftCommand extends AlignCommand {
   get alignment() {
      return Alignment.Near;
   }

   get propKey() {
      return 'left';
   }
}

export class AlignBottomCommand extends AlignCommand {
   get alignment() {
      return Alignment.Far;
   }

   get propKey() {
      return 'bottom';
   }
}

export class AlignRightCommand extends AlignCommand {
   get alignment() {
      return Alignment.Far;
   }

   get propKey() {
      return 'right';
   }
}

export class AlignTopCommand extends AlignCommand {
   get alignment() {
      return Alignment.Near;
   }

   get propKey() {
      return 'top';
   }
}

export class AlignVCenterCommand extends AlignCommand {
   get alignment() {
      return Alignment.Center;
   }

   get propKey() {
      return 'centerY';
   }
}