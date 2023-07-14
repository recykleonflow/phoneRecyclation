import { Injectable } from '@angular/core';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {HttpClient, HttpParams} from '@angular/common/http';
import {UserPayload} from '../../../../../../../libs/shared_models/model/user-payload.model';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(public firestore: AngularFirestore, private http: HttpClient) { }

  getUsers(queryText: string | null): Promise<any[]> {
    return new Promise<any>((resolve) => {
      return this.firestore.collection<any>('users',
          ref => ref
              .orderBy('email')
              .startAt(queryText)
              .endAt(queryText+"\uf8ff")
              .limit(20))
          .valueChanges()
          .subscribe(users => resolve(users))
    })
  }

  getUsersByEmail(email: string): Observable<UserPayload[]> {
    const params = new HttpParams().set('email', email);
    return this.http.get<UserPayload[]>('/api/user/find', {params})
  }
}
