import { AlignCommand, Alignment } from '~/commands'

export class AlignTopCommand extends AlignCommand {
   get alignment() {
      return Alignment.Near;
   }

   get propKey() {
      return 'top';
   }
}