import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImageGenerationService {
  constructor(private http: HttpClient) { }

  public generatePhoneImage(phone: string): Observable<any> {
    const headers = new HttpHeaders();
    return this.http.post<any>('/api/image-generation/generate', {
        phone,
    }, { headers, responseType: 'blob' as 'json'});
  }
  
  public generatePhoneImageFast(phone: string): Observable<any> {
    const headers = new HttpHeaders();
    return this.http.post<any>('/api/image-generation/generate-fast', {
        phone,
    }, { headers, responseType: 'blob' as 'json'});
  }
}