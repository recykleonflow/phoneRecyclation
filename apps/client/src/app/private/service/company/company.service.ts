import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CompanyPayload} from '../../../../../../../libs/shared_models/model/company-payload.model';

@Injectable({
    providedIn: 'root'
})
export class CompanyService {

    constructor(private http: HttpClient) {
    }

    getRetailCompanies(): Observable<CompanyPayload[]> {
        return this.http.get<CompanyPayload[]>('/api/company/retail')
    }
}
