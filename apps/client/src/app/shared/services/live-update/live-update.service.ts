import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {AuthService} from '../auth.service';
import {distinctUntilChanged, filter, lastValueFrom, map, Observable, Subject, tap} from 'rxjs';
import {v4 as uuid} from 'uuid';
import {UpdatedEntityType} from './updated-entity.enum';
import {UpdateEntityModel} from './update-entity-model';

@Injectable({
    providedIn: 'root'
})
export class LiveUpdateService {

    static sessionId = uuid();
    userFirebaseId!: string;
    private onUpdate$ = new Subject<UpdateEntityModel>();

    constructor(private afs: AngularFirestore,
                private authService: AuthService) {

        const user = this.authService.userData;
        this.userFirebaseId = user.firebaseId;
        console.log(user.firebaseId);
        const docRef = this.afs.doc(`users/${this.userFirebaseId}`);
        docRef.snapshotChanges().subscribe(snapshot => {
            const data = snapshot.payload.data() as {
                update: UpdateEntityModel
            };
            if (data && data.update) {
                try {
                    this.onUpdate$.next(data.update);
                } catch (error) {
                    console.error('Problem with parsing of payload');
                }
                // This function will be called whenever the 'ping' field of the user's document changes.
                // You can update your page or reload the page here.
            }
        });

    }

    async performUpdate(updatedEntity: UpdatedEntityType, payload: any, maskSessionId = false): Promise<void> {
        const docRef = this.afs.doc(`users/${this.userFirebaseId}`);
        const doc = await lastValueFrom(docRef.get());

        if (doc) {
            const update = (doc.data() as any)?.update || {};

            await docRef.update({
                update: {
                    ...update,
                    [updatedEntity]: {
                        invokedSession: maskSessionId ? null : LiveUpdateService.sessionId,
                        payload: payload || new Date()
                    }
                }
            })
        }
    }

    onUpdate<T>(listeningForEntity: UpdatedEntityType): Observable<T> {
        return this.onUpdate$.asObservable()
            .pipe(
                filter(updated =>
                    !!updated[listeningForEntity] &&
                    updated[listeningForEntity].invokedSession !== LiveUpdateService.sessionId &&
                    updated[listeningForEntity].payload
                ),
                distinctUntilChanged((prev, curr) =>
                    JSON.stringify(prev[listeningForEntity].payload) === JSON.stringify(curr[listeningForEntity].payload)),
                map(update => {
                    try {
                        return update[listeningForEntity].payload
                    } catch (e) {
                        console.error('Problem parsing the live payload', e);
                    }
                }));
    }
}
