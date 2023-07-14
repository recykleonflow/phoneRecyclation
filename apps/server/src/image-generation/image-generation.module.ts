import {Module} from '@nestjs/common';
import { ImageGenerationService } from './service/image-generation.service';
import { HttpModule } from '@nestjs/axios';
import { MidjourneyService } from './service/midjourney.service';
import { ImageGenerationController } from './controller/image-generation.controller';
import { PhoneArenaScrapperService } from './service/phonearena-scrapper.service';
import { ImageGenerationConfigService } from './service/image-generation-config.service';
import { PinataModule } from 'src/pinata/pinata.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GeneratedBackgroundEntity } from 'src/core/entities/generated-background.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([GeneratedBackgroundEntity]),
    HttpModule,
    PinataModule,
  ],
  providers: [ImageGenerationService, MidjourneyService, PhoneArenaScrapperService, ImageGenerationConfigService],
  exports: [ImageGenerationService, MidjourneyService, PhoneArenaScrapperService, ImageGenerationConfigService],
  controllers: [ImageGenerationController]
})
export class ImageGenerationModule {}
