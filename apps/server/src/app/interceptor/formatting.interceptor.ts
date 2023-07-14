import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import {map, Observable} from 'rxjs';
import { tap } from 'rxjs/operators';
import {HelperUtil} from '../util/helper.util';

@Injectable()
export class FormattingInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        //console.log('Before...');

        const now = Date.now();
        return next
            .handle()
            .pipe(
                map(data => {
                    return HelperUtil.removeDoubleQuotes(data);
                }),
                tap((data) => {
                    //console.log(`After... ${Date.now() - now}ms`);
                }),
            );
    }
}
