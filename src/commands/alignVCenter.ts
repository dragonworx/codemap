import { AlignCommand, Alignment } from '~/commands'

export class AlignVCenterCommand extends AlignCommand {
   get alignment() {
      return Alignment.Center;
   }

   get propKey() {
      return 'centerY';
   }
}