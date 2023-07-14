import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import * as firebase from 'firebase-admin';
import * as serviceAccount from '../service-account.json';
import {FirebaseService} from '../../firebase/service/firebase.service';
import {UserService} from '../service/user.service';

@Injectable()
export class PreauthMiddleware implements NestMiddleware {
  private defaultApp: any;

  constructor(private firebaseService: FirebaseService,
              private userService: UserService) {
    this.defaultApp =  this.firebaseService.firebaseApp;
  }

  use(req: Request, res: Response, next: Function) {
    const token = req.headers.authorization;
    if (token != null && token != '') {
      this.defaultApp.auth().verifyIdToken(token.replace('Bearer ', ''))
          .then(async decodedToken => {
            let dbUser = await this.userService.getUserByFirebaseId(decodedToken.user_id);
            if (!dbUser) {
              dbUser = await this.userService.createOrUpdateDbUserWithFirebase(decodedToken.user_id, decodedToken.email);
            }

            req['user'] = {
                ...dbUser,
                name: decodedToken.name,
                picture: decodedToken.picture,
                email: decodedToken.email
            };
            next();
          }).catch(error => {
        this.accessDenied(req.url, res);
      });
    } else {
      next();
    }
  }

  private accessDenied(url: string, res: Response) {
    res.status(403).json({
      statusCode: 403,
      timestamp: new Date().toISOString(),
      path: url,
      message: 'Access Denied'
    });
  }
}
