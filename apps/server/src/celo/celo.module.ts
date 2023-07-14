import {Module} from '@nestjs/common';
import { CeloService } from './service/celo.service';

@Module({
  imports: [],
  providers: [CeloService],
  exports: [CeloService],
  controllers: []
})
export class CeloModule {}
