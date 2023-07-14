import {Module} from '@nestjs/common';
import { PinataService } from './service/pinata.service';

@Module({
  imports: [],
  providers: [PinataService],
  exports: [PinataService],
  controllers: []
})
export class PinataModule {}
