import { HttpService } from '@nestjs/axios';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { Client, GatewayIntentBits, Message, TextChannel } from 'discord.js';
import { EventEmitter } from 'events';
import { ImageGenerationConfigService } from './image-generation-config.service';

@Injectable()
export class MidjourneyService implements OnModuleInit {
    private client: Client;
    private imageEventEmitter: EventEmitter;
    
    private generatedBackgroundUrls = [];
    private numberOfUpscales = 4; // MIN = 1, MAX = 4;

    constructor(
        private readonly httpService: HttpService,
        private readonly imageGenerationConfigService: ImageGenerationConfigService,
    ) {
        this.imageEventEmitter = new EventEmitter();
    }

    public async getNumberOfUpscales() {
        return this.numberOfUpscales;
    }

    async onModuleInit(): Promise<void> {
        //const botToken = this.imageGenerationConfigService.getBotToken();
        //this.client = new Client({
        //    intents:[GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
        //});
        //this.client.on("ready", () =>{
        //    this.interactWithMidJourneyBot(this.numberOfUpscales);
        //});
        //this.client.login(botToken);
    }

    public async waitForUrlsGeneration(): Promise<string[]> {
        return new Promise((resolve) => {
          this.imageEventEmitter.once(`generation_done`, (url) => {
            resolve(this.generatedBackgroundUrls);
          });
        });
    }

    public async getMidjourneyImage(prompt: string) {
        // empty list
        this.generatedBackgroundUrls = [];
        const authorizationToken = this.imageGenerationConfigService.getAuthorizationToken();
        const generationConfig = this.imageGenerationConfigService.getGenerationConfig();

        generationConfig.data.options = [{
            "type":3,
            "name":"prompt",
            "value":prompt,
        }];
        const generationConfigJSON = JSON.stringify(generationConfig);
        var bodyFormData = new FormData();
        bodyFormData.append('payload_json', generationConfigJSON);
        
        const { data } = await firstValueFrom(
            this.httpService.post<any>('https://discord.com/api/v9/interactions', bodyFormData, {
                headers: {
                    'authorization': authorizationToken,
                    'Content-Type': 'multipart/form-data'
                }
            }).pipe(
              catchError((error: AxiosError) => {
                console.log(error.response.data);
                throw 'An error happened!';
              }),
            ),
        );
    }

    private async interactWithMidJourneyBot(numberOfUpscales = 1): Promise<void> {
        const midjourneyBotId = this.imageGenerationConfigService.getMidjourneyBotId();
        const upscaleConfig = this.imageGenerationConfigService.getUpscaleConfig();
        const authorizationToken = this.imageGenerationConfigService.getAuthorizationToken();

        // Listen for a message event from the MidJourney bot
        this.client.on('messageCreate', async (message: Message) => {
          if (message.author.id === midjourneyBotId && message.attachments.first()) {
            const imageURL = message.attachments.first().url;
            const imageGuid = imageURL.substring(imageURL.lastIndexOf('.')-36,imageURL.lastIndexOf('.'));
            
            if (message.reference) {
                this.onImageUrlGenerated(imageURL);
            }
            else {
                for (let i = 1; i <= numberOfUpscales; i++) {
                    upscaleConfig.data.custom_id = `MJ::JOB::upsample::${i}::${imageGuid}`;
                    upscaleConfig.message_id = message.id;
                    const upscaleConfigJson = JSON.stringify(upscaleConfig);

                    console.log(upscaleConfigJson);

                    try {
                        const { data } = await firstValueFrom(
                            this.httpService.post<any>('https://discord.com/api/v9/interactions', upscaleConfigJson, {
                                headers: {
                                    'authorization': authorizationToken,
                                    'Content-Type': 'application/json'
                                }
                            }));
                    }
                    catch (e) {
                    }   
                    await this.sleep(1000);
                }
            }
          }
        });
    }

    private onImageUrlGenerated(url: string) {
        this.generatedBackgroundUrls.push(url);
        if (this.generatedBackgroundUrls.length >= this.numberOfUpscales) {
            this.imageEventEmitter.emit(`generation_done`, url);
        }
    }

    public async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}
