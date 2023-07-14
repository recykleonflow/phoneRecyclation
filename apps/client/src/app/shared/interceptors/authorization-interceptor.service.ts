import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpRequest, HttpResponse} from '@angular/common/http';
import {from, Observable, switchMap, tap} from 'rxjs';
import {AuthService} from '../services/auth.service';
import {Capacitor, CapacitorHttp} from '@capacitor/core';
import {environment} from '../../../environments/environment';


@Injectable()
export class AuthorizationInterceptor implements AuthorizationInterceptor {

    constructor(private authService: AuthService) {
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        return this.authService.getToken().pipe(switchMap((token) => {

            request = request.clone({
                url: environment.url + request.url,
                setHeaders: {
                    Authorization: `Bearer ${token}`,
                }
            });
            return this.handlePlatformRequest(request, next);
        }));
    }

    private handlePlatformRequest(req: HttpRequest<any>, next: HttpHandler) {

        // if (Capacitor.isNativePlatform()) {
        //     // For native platforms, use Capacitor's Http plugin
        //     const {url, method, body, headers} = req;
        //
        //     const request = from(CapacitorHttp.request({
        //         method: method.toUpperCase(),
        //         url,
        //         headers: headers.keys().reduce((headerObj, key) => ({...headerObj, [key]: headers.get(key)}), {}),
        //         data: body,
        //     }));
        //
        //     console.log('REQUEST ON ', url);
        //     return request.pipe(
        //         tap(r => console.log(r)),
        //         switchMap(({data, status}) => {
        //             return [new HttpResponse({body: data, status})];
        //         })
        //     );
        // } else {
            // For non-native platforms, use the default Angular HTTP implementation
            return next.handle(req);
        // }
    }

}
