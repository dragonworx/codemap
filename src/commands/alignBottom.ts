import { AlignCommand, Alignment } from '~/commands'

export class AlignBottomCommand extends AlignCommand {
   get alignment() {
      return Alignment.Far;
   }

   get propKey() {
      return 'bottom';
   }
}