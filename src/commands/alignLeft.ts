import { AlignCommand, Alignment } from '~/commands'

export class AlignLeftCommand extends AlignCommand {
   get alignment() {
      return Alignment.Near;
   }

   get propKey() {
      return 'left';
   }
}