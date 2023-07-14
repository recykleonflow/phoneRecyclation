import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import { throws } from 'assert';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private _isLoading = false;
  private _isToolbarLoading = false;
  public facts: string[] = [];
  public actualFact = '';

  get isToolbarLoading() {
    return this._isToolbarLoading;
  }

  set isToolbarLoading(isToolbarLoading: boolean) {
    if (isToolbarLoading !== this._isToolbarLoading) {
      this._isToolbarLoading = isToolbarLoading;
    }
  }

  get isLoading() {
    return this._isLoading;
  }

  set isLoading(isLoading: boolean) {
    if (isLoading !== this._isLoading) {
      this.actualFact = this.facts[this.getRandomNumber(this.facts.length - 1)];
      this._isLoading = isLoading;
    }
  }

  constructor(private http: HttpClient) {
    this.getFacts().subscribe(
        facts => this.facts = facts.map(fact => fact.text)
    )
  }

  getFacts(): Observable<{text: string}[]> {
    return this.http.get<{text: string}[]>('/api/fact');
  }

  private getRandomNumber(n: number): number {
    return Math.floor(Math.random() * (n + 1));
  }
}
