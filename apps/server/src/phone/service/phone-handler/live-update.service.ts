import {Injectable} from '@nestjs/common';
import {UpdatedEntityType} from '../../../../../client/src/app/shared/services/live-update/updated-entity.enum';
import {Firestore} from '@google-cloud/firestore';
import {FirebaseService} from '../../../firebase/service/firebase.service';
import {UserService} from '../../../authorization/service/user.service';
import {UpdateEntityModel} from '../../../../../client/src/app/shared/services/live-update/update-entity-model';

@Injectable()
export class LiveUpdateService {

    db: Firestore;
    constructor(private firebaseService: FirebaseService,private userService: UserService) {

    }

    async performUpdate(updatedEntity: UpdatedEntityType, userId: string, payload?: any): Promise<void> {
        const user = await this.userService.getUserById(userId);
        const db = this.firebaseService.firebaseApp.firestore();

        if (user?.firebaseId) {
            const docRef = db.doc(`users/${user?.firebaseId}`);
            const doc = await docRef.get();

            if (doc && doc.data()) {
                const update = (doc.data() as {update: UpdateEntityModel})?.update || {};

                await docRef.update({update: {
                        ...update,
                        [updatedEntity]: {invokedSession: null, payload: payload || {time: new Date()}}}})
            }

        }
    }

    // async performSuccessPhoneAdd(userId: string, ual: string): Promise<void> {
    //     const updatedEntity: UpdatedEntityType = UpdatedEntityType.QUEUE;
    //     const user = await this.userService.getUserById(userId);
    //     const db = this.firebaseService.firebaseApp.firestore();
    //
    //     if (user?.firebaseId) {
    //         const docRef = db.doc(`users/${user?.firebaseId}`);
    //         const doc = await docRef.get();
    //
    //         if (doc) {
    //             const update = (doc.data() as {update: UpdateEntityModel}).update || {};
    //
    //             await docRef.update({update: {
    //                     ...update,
    //                     [updatedEntity]: {invokedSession: null, payload: payload || {time: new Date()}}}})
    //         }
    //
    //     }
    // }
}
