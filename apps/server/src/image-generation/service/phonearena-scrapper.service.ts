import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosError } from 'axios';
import { Observable, catchError, firstValueFrom } from 'rxjs';
import * as cheerio from 'cheerio';

@Injectable()
export class PhoneArenaScrapperService {
    public defaultImageUrl = "https://cdn-icons-png.flaticon.com/512/77/77110.png";  

    constructor(
        private readonly httpService: HttpService,
    ) {}

    async getPhoneHtml(phoneTitle: string) {
      let firstImageLink = this.defaultImageUrl;
      try {
        const searchResult = await firstValueFrom(
          this.httpService.get<any>(`https://www.phonearena.com/search?term=${phoneTitle}`)
      );

      let $ = cheerio.load(searchResult.data);
      const firstLinkElement = $('.phones-results a').first();
      const firstLink = firstLinkElement.attr('href');

      const phoneResult: any = await firstValueFrom(
          this.httpService.get<any>(firstLink)
      );
 
      $ = cheerio.load(phoneResult.data);
      const srcset = $('picture.portrait img').attr('srcset');
      const imageLinks = srcset.split(',').map(link => link.trim().split(' ')[0]);
      firstImageLink = imageLinks[0];       
      return firstImageLink;
      }
      catch (e) {
        console.log(e);
        return firstImageLink;
      }
    }

}
