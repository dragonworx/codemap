import { AlignCommand, Alignment } from '~/commands'

export class AlignHCenterCommand extends AlignCommand {
   get alignment() {
      return Alignment.Center;
   }

   get propKey() {
      return 'centerX';
   }
}