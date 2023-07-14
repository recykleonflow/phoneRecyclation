import { Injectable } from "@nestjs/common";
import { BackgroundPrompt } from "../enum/background-prompt.enum";
import { MidjourneyPrompt } from "../model/midjourney-prompt";

@Injectable()
export class ImageGenerationConfigService {
    constructor() {}
    // todo: keys to env
    private channelId = '';
    private midjourneyBotId = '';
    private botToken = '';
    private authorizationToken = '';

    private midjourneyPrompts: MidjourneyPrompt[] = [
        {
            name: BackgroundPrompt.FLAMES1,
            prompt: "modern simple background, cartoon, flames, lightning, bright colors --no text, logo"
        },
        {
            name: BackgroundPrompt.FLAMES2,
            prompt: "simple beautiful background, bright colors, flames, lightning --no text, logo"
        },
        {
            name: BackgroundPrompt.GREEN,
            prompt: "beautiful background desktop wallpaper, bright colors, green tint --no text, logo, object --s 250" 
        },
        {
            name: BackgroundPrompt.ABSTRACT,
            prompt: "shining background shapes, abstract, bright colors --no text, logo, objects"
        },
        {
            name: BackgroundPrompt.LIGHTS,
            prompt: "shining background lights, abstract, bright colors --no text, logo, objects"
        },
        {
            name: BackgroundPrompt.FLARES,
            prompt: "shining background flares, bright colors --no text, logo, objects"
        }
    ]

    // black magic configs
    private generationConfig: any = {
        type:2,
        application_id:"936929561302675456",
        guild_id:"1063052328535592970",
        channel_id:"1108817099356385330",
        session_id:"c05b19d4409db69a4a6acdf1bdf8728e",
        data:{
           version:"1077969938624553050",
           id:"938956540159881230",
           name:"imagine",
           type:1,
           options:[
              {
                 type:3,
                 name:"prompt",
                 value:"%prompt%"
              }
           ],
           application_command:{
              id:"938956540159881230",
              application_id:"936929561302675456",
              version:"1077969938624553050",
              default_member_permissions:null,
              type:1,
              nsfw:false,
              name:"imagine",
              description:"Create images with Midjourney",
              dm_permission:true,
              options:[
                 {
                    type:3,
                    name:"prompt",
                    description:"The prompt to imagine",
                    required:true
                 }
              ]
           },
           attachments:[   
           ]
        }
    }
    
    private upscaleConfig: any = {
        type:3,
        guild_id:"1063052328535592970",
        channel_id:"1108817099356385330",
        message_flags:0,
        message_id:"1108751531676798999",
        application_id:"936929561302675456",
        session_id:"c05b19d4409db69a4a6acdf1bdf8728e",
        data:{
            component_type:2,
            custom_id:"MJ::JOB::upsample::4::826c2c86-6d64-406d-ba68-472389532faa"
        }
    }

    public getMidjourneyBotId() {
        return this.midjourneyBotId;
    }

    public getChannelId() {
        return this.channelId;
    }

    public getBotToken() {
        return this.botToken;
    }

    public getAuthorizationToken() {
        return this.authorizationToken;
    }

    public getGenerationConfig() {
        return this.generationConfig;
    }

    public getUpscaleConfig() {
        return this.upscaleConfig;
    }

    public getPromptByEnum(enumName: BackgroundPrompt) {
        return this.midjourneyPrompts.find(x => x.name === enumName)?.prompt;
    }

    public getRandomPrompt() {
        return this.midjourneyPrompts[Math.floor(Math.random()*this.midjourneyPrompts.length)]?.prompt;
    }

    public getAllPrompts() {
        return this.midjourneyPrompts;
    }
}
