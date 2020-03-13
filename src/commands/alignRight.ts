import { AlignCommand, Alignment } from '~/commands'

export class AlignRightCommand extends AlignCommand {
   get alignment() {
      return Alignment.Far;
   }

   get propKey() {
      return 'right';
   }
}