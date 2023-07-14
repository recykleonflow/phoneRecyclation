import { Injectable } from '@nestjs/common';
import { MidjourneyService } from './midjourney.service';
import * as sharp from 'sharp';
import axios from 'axios';
import { PhoneArenaScrapperService } from './phonearena-scrapper.service';
import { Raw } from 'sharp';
import path = require('path');
import fs = require('fs');
import { ImageGenerationConfigService } from './image-generation-config.service';
import { PinataService } from 'src/pinata/service/pinata.service';
import { GenerateImageOutput } from '../model/generate-image-output';
import { InjectRepository } from '@nestjs/typeorm';
import { GeneratedBackgroundEntity } from 'src/core/entities/generated-background.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ImageGenerationService {
    
    constructor(
        private readonly pinataService: PinataService,
        private readonly midjourneyService: MidjourneyService,
        private readonly imageGenerationConfigService: ImageGenerationConfigService,
        private readonly phoneArenaScrapperService: PhoneArenaScrapperService,
        @InjectRepository(GeneratedBackgroundEntity) private readonly generatedBackgroundRepository: Repository<GeneratedBackgroundEntity>,
    ) {

      //this.pregenerateBackgroundUrls(10);
    }

    public async pregenerateBackgroundUrls(countForEachPrompt: number) {
      const prompts = this.imageGenerationConfigService.getAllPrompts();
      for (const prompt of prompts) {
        for (let i = 0; i < countForEachPrompt; i++) {
          await this.midjourneyService.getMidjourneyImage(prompt.prompt);
          const urls = await this.midjourneyService.waitForUrlsGeneration();
          for (const url of urls) {
            await this.generatedBackgroundRepository.save({
              ...new GeneratedBackgroundEntity(),
              prompt: prompt.prompt,
              url
            });
          }
        }
      }
    }

    public async generatePhoneImage(phoneModel: string) {
      try {
        // phonearena image scrapper
        const phoneUrl = await this.phoneArenaScrapperService.getPhoneHtml(phoneModel);

        const phoneBuffer = await this.getBufferFromUrl(phoneUrl);
        const phoneBufferCropped = await this.getPhoneImage(phoneBuffer);
        
        // upload phone image to pinata
        const pinataPhoneIpfsHash = await this.pinataService.uploadPhoneBuffer(phoneBufferCropped, phoneModel);
        return pinataPhoneIpfsHash;
    }
    catch (e) {
        console.log(e);
    }
    }

    public async generateImageFast(phoneModel: string, imei: string) {
        try {
            // midjourney pregenerated background 
            const unusedBackgrounds = await this.generatedBackgroundRepository.find({where: {used: false}});
            const randomBackground = unusedBackgrounds[Math.floor(Math.random()*unusedBackgrounds.length)];
            await this.generatedBackgroundRepository.save({
              ...randomBackground,
              used: true,
            })
            const backgroundUrl = randomBackground.url;

            // phonearena image scrapper
            const phoneUrl = await this.phoneArenaScrapperService.getPhoneHtml(phoneModel);

            // get buffers and overlay image
            const backgroundBuffer = await this.getBufferFromUrl(backgroundUrl);
            const phoneBuffer = await this.getBufferFromUrl(phoneUrl);
            const phoneBufferCropped = await this.getPhoneImage(phoneBuffer);
            const resultImage = await this.overlayImages(backgroundBuffer,phoneBufferCropped);

            // upload phone image to pinata
            const pinataPhoneIpfsHash = await this.pinataService.uploadPhoneBuffer(phoneBufferCropped, phoneModel);

            // upload background image to pinata
            const pinataBackgroundIpfsHash = await this.pinataService.uploadImageBuffer(backgroundBuffer, phoneModel, imei, 'BACKGROUND');

            // upload overlay image 
            const pinataOverlayIpfsHash = await this.pinataService.uploadImageBuffer(resultImage, phoneModel, imei, 'OVERLAY');

            // upload metadata
            const metadataIpfsHash = await this.pinataService.uploadNftMetadata(phoneModel, imei, pinataOverlayIpfsHash);

             return {
              ...new GenerateImageOutput(),
              phoneIpfs: pinataPhoneIpfsHash,
              backgroundIpfs: pinataBackgroundIpfsHash,
              compositeIpfs: pinataOverlayIpfsHash,
              metadataIpfs: metadataIpfsHash,
            };
        }
        catch (e) {
            console.log('IMAGE GENERATION ERROR');
        }
    }

    private async getBufferFromUrl(url: string): Promise<Buffer> {
        const response = await axios.get(url, {
            responseType: 'arraybuffer',
        });
        return Buffer.from(response.data, 'binary');
    }

    private async getPhoneImage(phoneBuffer: Buffer): Promise<Buffer> {
       // Get the phone image metadata
       const phoneMetadata = await sharp(phoneBuffer).metadata();

       // Resize the phone image to the desired size, if necessary
       const resizedPhoneBuffer = await sharp(phoneBuffer)
       .resize({
           width: Math.round(phoneMetadata.width * 0.8),
           height: Math.round(phoneMetadata.height * 0.8),
         }) // Adjust the width and height as needed
       .toBuffer();

       // crop image
       const croppedPhoneBuffer = await this.cropImageToPhone(resizedPhoneBuffer);
       
       // make white border pixels transparent
       const resultBuffer = await this.makeWhitePixelsTransparent(croppedPhoneBuffer,70); // tolerance can be changed
       return resultBuffer;
    }

    private async overlayImages(backgroundBuffer: Buffer, phoneBuffer: Buffer): Promise<Buffer> {
        // Load the background image from buffer
        const background = sharp(backgroundBuffer);

        // Overlay the phone image onto the background image
        const resultBuffer = await background
            .composite([
            {
                input: phoneBuffer,
            },
            ])
            .toBuffer();
        
        // const bufferWithLogo = await this.addLogoToImage(resultBuffer,path.resolve('./apps/server/src/assets/logo_white.png'),20);
        return resultBuffer;
    }

    private async makeWhitePixelsTransparent(inputBuffer: Buffer, tolerance: number) {
        try {
         // Convert the image to a raw pixel buffer with an alpha channel
          const raw = await sharp(inputBuffer).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
      
          const data = raw.data;
          const info = raw.info;
      
          const isWhitePixel = (data: Buffer, idx: number, tolerance: number): boolean => {
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];
      
            return r >= 255 - tolerance && g >= 255 - tolerance && b >= 255 - tolerance;
          };
      
          const visited = new Set<number>();
      
          const floodFill = (x: number, y: number) => {
            const stack = [{ x, y }];
      
            while (stack.length) {
              const { x, y } = stack.pop()!;
      
              if (x < 0 || x >= info.width || y < 0 || y >= info.height) {
                continue;
              }
      
              const idx = (info.width * y + x) * info.channels;
      
              if (visited.has(idx) || !isWhitePixel(data, idx, tolerance)) {
                continue;
              }
      
              visited.add(idx);
      
              // Make the pixel transparent
              data[idx + 3] = 0;
      
              stack.push({ x: x - 1, y });
              stack.push({ x: x + 1, y });
              stack.push({ x, y: y - 1 });
              stack.push({ x, y: y + 1 });
            }
          };
      
          // Flood fill from the borders
          for (let x = 0; x < info.width; x++) {
            floodFill(x, 0);
            floodFill(x, info.height - 1);
          }
      
          for (let y = 1; y < info.height - 1; y++) {
            floodFill(0, y);
            floodFill(info.width - 1, y);
          }
      
          // Convert the modified raw pixel buffer back to an image format (PNG) and save the output image
          const resultBuffer = await sharp(data, { raw: info })
            .png()
            .toBuffer();
          return resultBuffer;
        } catch (error) {
          console.error('Error processing image:', error);
        }
    }

    private async addWhiteBorder(imageBuffer: Buffer, borderWidth: number): Promise<Buffer> {
        const image = sharp(imageBuffer);
        const metadata = await image.metadata();
      
        const newWidth = metadata.width! + borderWidth * 2;
        const newHeight = metadata.height! + borderWidth * 2;
      
        const resultBuffer = await sharp({
          create: {
            width: newWidth,
            height: newHeight,
            channels: 4,
            background: { r: 255, g: 255, b: 255, alpha: 1 },
          },
        })
          .composite([
            {
              input: imageBuffer,
              top: borderWidth,
              left: borderWidth,
            },
          ])
          .png()
          .toBuffer();
      
        return resultBuffer;
    }
    
    private async cropImageToPhone(inputBuffer: Buffer): Promise<Buffer> {
        try {
            const { data, info } = await sharp(inputBuffer)
                .raw()
                .toBuffer({ resolveWithObject: true });
      
            const tolerance = 10; // Adjust this value as needed

            const isWhitePixel = (data: Buffer, idx: number): boolean => {
                const r = data[idx];
                const g = data[idx + 1];
                const b = data[idx + 2];
                return (
                    Math.abs(r - 255) <= tolerance &&
                    Math.abs(g - 255) <= tolerance &&
                    Math.abs(b - 255) <= tolerance
                );
            };
      
            const isWhiteRow = (data: Buffer, y: number, info: Raw): boolean => {
                for (let x = 0; x < info.width; x++) {
                    const idx = (info.width * y + x) * info.channels;
                    if (!isWhitePixel(data, idx)) return false;
                }
                return true;
            };
      
            const isWhiteColumn = (data: Buffer, x: number, info: Raw): boolean => {
                for (let y = 0; y < info.height; y++) {
                    const idx = (info.width * y + x) * info.channels;
                    if (!isWhitePixel(data, idx)) return false;
                }
                return true;
            };
      
            const centerX = Math.floor(info.width / 2);
            const centerY = Math.floor(info.height / 2);
      
            let top = centerY;
            let bottom = centerY;
            let left = centerX;
            let right = centerX;
      
            while (top > 0 && !isWhiteRow(data, top, info)) {
                top--;
            }
      
            while (bottom < info.height - 1 && !isWhiteRow(data, bottom, info)) {
                bottom++;
            }
      
            while (left > 0 && !isWhiteColumn(data, left, info)) {
                left--;
            }
      
            while (right < info.width - 1 && !isWhiteColumn(data, right, info)) {
                right++;
            }
      
            const width = right - left + 1;
            const height = bottom - top + 1;
      
            const outputBuffer = await sharp(inputBuffer)
                .extract({ left, top, width, height })
                .toBuffer();
      
            return outputBuffer;
        } catch (error) {
            console.error('Error cropping image:', error);
        }
    }

    private async addLogoToImage(imageBuffer: Buffer, logoPath: string, borderWidth: number): Promise<Buffer> {
        const image = sharp(imageBuffer);
        const metadata = await image.metadata();
      
        // Read the logo into a buffer  
        const logoBuffer = fs.readFileSync(logoPath);
        const logoMetadata = await sharp(logoBuffer).metadata();
      
        // resize logo
        const resizedLogoBuffer = await sharp(logoBuffer)
        .resize({
            width: Math.round(logoMetadata.width * 0.3),
            height: Math.round(logoMetadata.height * 0.3),
          }) // Adjust the width and height as needed
        .toBuffer();

        const logoResizedMetadata = await sharp(resizedLogoBuffer).metadata();

        // Calculate the logo's position
        const logoTop = borderWidth; // Position logo at the top edge considering the borderWidth
        const logoLeft = metadata.width! - logoResizedMetadata.width! - borderWidth; // Position logo at the right edge considering the borderWidth
      
        const resultBuffer = await image
          .composite([
            {
              input: resizedLogoBuffer,
              top: logoTop,
              left: logoLeft,
            },
          ])
          .png()
          .toBuffer();
      
        return resultBuffer;
    }
}
