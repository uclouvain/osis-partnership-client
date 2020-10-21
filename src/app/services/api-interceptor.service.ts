import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  constructor(private translateService: TranslateService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Only work on API requests
    if (req.url.startsWith(environment.api.url)) {
      let newHeaders = req.headers;

      // Set authorization from env
      newHeaders = newHeaders.set('Authorization', environment.api.authorizationHeader);

      // Set language from trnasltion
      const lang = this.translateService.currentLang || this.translateService.getDefaultLang();
      newHeaders = newHeaders.set('Accept-Language', lang);

      return next.handle(req.clone({ headers: newHeaders }));
    }
    return next.handle(req);
  }
}
