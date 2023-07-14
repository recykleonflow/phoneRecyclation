import {Injectable, NgZone} from '@angular/core';
import * as auth from 'firebase/auth';
import {getAuth, GoogleAuthProvider} from 'firebase/auth';
import {AngularFireAuth} from '@angular/fire/compat/auth';
import {AngularFirestore, AngularFirestoreDocument,} from '@angular/fire/compat/firestore';
import {ActivatedRoute, Router} from '@angular/router';
import {lastValueFrom, Observable, Subject, switchMap, take} from 'rxjs';
import {RoleSelectionService} from '../../private/service/role-selection/role-selection.service';
import {UserRole} from '../../../../../../libs/shared_models/enum/user-role';
import {Capacitor} from '@capacitor/core';

import {FirebaseAuthentication} from '@capacitor-firebase/authentication';
import {indexedDBLocalPersistence, initializeAuth, signInWithCredential} from '@angular/fire/auth';
import {getApp, initializeApp} from '@angular/fire/app';
import {Platform} from '@ionic/angular';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {UserPayload} from '../../../../../../libs/shared_models/model/user-payload.model';
import {LoadingService} from '../../loading.service';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    public userData: UserPayload; // Save logged in user data
    public token: string = '';
    public isUserLoading$ = new Subject<boolean>();
    public currentUser$ = new Subject<UserPayload | null>();

    constructor(
        public afs: AngularFirestore, // Inject Firestore service
        public afAuth: AngularFireAuth, // Inject Firebase auth service
        public router: Router,
        public ngZone: NgZone, // NgZone service to remove outside scope warning
        private roleSelectionService: RoleSelectionService,
        private activatedRoute: ActivatedRoute,
        private platform: Platform,
        private http: HttpClient
    ) {
        FirebaseAuthentication.removeAllListeners().then(() => {
            FirebaseAuthentication.addListener('authStateChange', (change) => {
                this.ngZone.run(async () => {
                    const shouldNavigate = !!this.userData && window.location.href.indexOf('private') === -1;
                    await this.setUserDataAndToken(change.user, shouldNavigate);
                });
            });
        });
        // Only needed to support dev livereload.
        FirebaseAuthentication.getCurrentUser().then((result) => {
            if (result.user) {
                this.setUserDataAndToken(result.user, false);
            }
            // this.currentUserSubject.next(result.user);
        });
        /* Saving user data in localstorage when
        logged in and setting up null when logged out */
        // const auth = this.getAppAuth();
        // console.log(auth);

    }

    public getUser(): Observable<UserPayload> {
        return this.http.get<UserPayload>('/api/user');
    }

    public async initialize(): Promise<void> {
        if (this.platform.is('capacitor')) {
            return;
        }
        /**
         * Only needed if the Firebase JavaScript SDK is used.
         *
         * Read more: https://github.com/robingenz/capacitor-firebase/blob/main/packages/authentication/docs/firebase-js-sdk.md
         */
        initializeApp(environment.firebase);
    }

    public getAppAuth() {
        if (Capacitor.isNativePlatform()) {
            return initializeAuth(getApp(), {
                persistence: indexedDBLocalPersistence
            });
        } else {
            return getAuth();
        }
    }

    // public init() {
    //     return this.setToken();
    // }

    public getToken(): Observable<string> {
        return this.afAuth.authState.pipe(
            switchMap(async (user: any) => {
                this.token = user?.multiFactor.user.accessToken;
                if (!this.token) {
                    await this.signOut();
                }
                return this.token;
            }));
    }

    signInWithWeb() {

    }

    signInWithMobile() {}

    // Sign in with email/password
    SignIn(email: string, password: string) {
        this.roleSelectionService.resetRole();
        return this.afAuth
            .signInWithEmailAndPassword(email, password)
            .then((result) => {
                this.setUserDataAndToken(result.user, true);
                this.router.navigate(['private']);
            })
            .catch((error) => {
                window.alert(error.message);
            });
    }

    // Sign up with email/password
    SignUp(email: string, password: string) {
        return this.afAuth
            .createUserWithEmailAndPassword(email, password)
            .then((result) => {
                /* Call the SendVerificaitonMail() function when new user sign
                up and returns promise */
                this.SendVerificationMail();
                this.setUserDataAndToken(result.user, true);
            })
            .catch((error) => {
                window.alert(error.message);
            });
    }

    // Send email verfificaiton when new user sign up
    SendVerificationMail() {
        return this.afAuth.currentUser
            .then((u: any) => u.sendEmailVerification())
            .then(() => {
                this.router.navigate(['public/verify-email-address']);
            });
    }

    // Reset Forggot password
    ForgotPassword(passwordResetEmail: string) {
        return this.afAuth
            .sendPasswordResetEmail(passwordResetEmail)
            .then(() => {
                window.alert('Password reset email sent, check your inbox.');
            })
            .catch((error) => {
                window.alert(error);
            });
    }

    // Returns true when user is looged in and email is verified
    get isLoggedIn(): boolean {
        const user = JSON.parse(localStorage.getItem('user')!);
        return user !== null && user.emailVerified !== false ? true : false;
    }

    // Sign in with Google
    googleSignIn() {
        this.roleSelectionService.resetRole();
        return this.login(new auth.GoogleAuthProvider()).then((res: any) => {

            if (res) {
                this.router.navigate(['private']);
            }
        });
    }

    facebookSignIn() {
        this.roleSelectionService.resetRole();
        return this.login(new auth.FacebookAuthProvider()).then((res: any) => {
            if (res) {
                this.router.navigate(['private']);
            }
        });
    }

    // Auth logic to run auth providers
    async login(provider: any) {

        if (Capacitor.getPlatform() === 'web') {
            const result = await this.afAuth.signInWithPopup(provider)
            await this.setUserDataAndToken(result.user, true);
        } else {
            if (provider.providerId === 'google.com') {
                const result = await FirebaseAuthentication.signInWithGoogle();
                const credential = GoogleAuthProvider.credential(result.credential?.idToken);
                const auth = getAuth();
                const userCredential = await signInWithCredential(auth, credential);
                // console.log('RESULT ');
                // await this.setUserDataAndToken(result.user);
            }
        }
    }

    /* Setting up user data when sign in with username/password,
    sign up with username/password and sign in with social auth
    provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
    async setUserDataAndToken(user: any, performNavigation: boolean): Promise<any> {
        if (user) {
            const userPayload = await lastValueFrom(this.getUser().pipe(take(1)));
            const userRef: AngularFirestoreDocument<any> = this.afs.doc(
                `users/${user.firebaseId || user.uid}`
            );
            await userRef.get().subscribe(
                async doc => {

                    this.token = user.multiFactor?.user.accessToken;
                    // if (user.emailVerified) {
                        this.roleSelectionService.setRole(userPayload.role);
                    // } else {
                    //     this.roleSelectionService.setRole(UserRole.NOT_VERIFIED);
                    // }
                    const userData: any = {
                        uid: user.uid,
                        email: user.email,
                        displayName: user.displayName,
                        photoURL: user.photoURL || null,
                        emailVerified: user.emailVerified,
                    };

                    this.userData = {...userPayload, emailVerified: user.emailVerified, firebaseId: user.firebaseId ?? user.uid};
                    if (!doc.exists) {
                        await userRef.set(userData, {
                            merge: true,
                        });
                    }
                    this.currentUser$.next(userPayload);
                    if (userPayload) {
                        localStorage.setItem('user', JSON.stringify(userPayload));
                        JSON.parse(localStorage.getItem('user')!);
                    }
                    if (performNavigation) {
                        await this.router.navigate(['private']);
                    }
                }
            );
        } else {
            this.currentUser$.next(null);
        }

    }

    // Sign out
    public signOut() {
        return this.afAuth.signOut().then(() => {
            this.userData = null;
            localStorage.removeItem('user');
            this.router.navigate(['public']);
        });
    }
}
