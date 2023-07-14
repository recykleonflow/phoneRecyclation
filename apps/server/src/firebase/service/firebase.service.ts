import {Injectable} from '@nestjs/common';
import * as firebase from 'firebase-admin';
import * as serviceAccount from '../../authorization/service-account.json';
import {app} from 'firebase-admin';


@Injectable()
export class FirebaseService {
    firebase_params = {
        type: serviceAccount.type,
        projectId: serviceAccount.project_id,
        privateKeyId: serviceAccount.private_key_id,
        privateKey: serviceAccount.private_key,
        clientEmail: serviceAccount.client_email,
        clientId: serviceAccount.client_id,
        authUri: serviceAccount.auth_uri,
        tokenUri: serviceAccount.token_uri,
        authProviderX509CertUrl: serviceAccount.auth_provider_x509_cert_url,
        clientC509CertUrl: serviceAccount.client_x509_cert_url
    }
    public firebaseApp: app.App;

    constructor() {
        this.firebaseApp = firebase.initializeApp({
            credential: firebase.credential.cert(this.firebase_params)
        });
    }
}
