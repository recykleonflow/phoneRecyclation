import { Component } from '@angular/core';
import {catchError, map, Observable, of, tap} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {CompanyService} from '../../service/company/company.service';

@Component({
  selector: 'app-location-page',
  templateUrl: './location-page.component.html',
  styleUrls: ['./location-page.component.scss']
})
export class LocationPageComponent {
 public apiLoaded: Observable<boolean>;

    center: google.maps.LatLngLiteral = {lat: 50.70805529890054, lng: 7.128928712838265};
    zoom = 16;
    markerOptions: google.maps.MarkerOptions = {
        draggable: false,
        };
    markerPositions: google.maps.LatLngLiteral[] = []; // [{lat: 50.70805529890054, lng: 7.128928712838265}];

 constructor(private httpClient: HttpClient,
             private companyService: CompanyService) {
    this.apiLoaded = httpClient.jsonp('', 'callback')
       .pipe(
           map(() => true),
           catchError(() => of(false)),
    );

    this.companyService.getRetailCompanies().subscribe(
        companies => {
            this.markerPositions
            = companies.map(company => ({lat: Number(company.latitude), lng: Number(company.longitude)}));
            this.center = this.markerPositions[0];
        });

     window.navigator.geolocation.getCurrentPosition(position => {
         this.center = {lat: position.coords.latitude, lng: position.coords.longitude};
     })
 }

}
