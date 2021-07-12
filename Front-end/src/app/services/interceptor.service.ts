import { Injectable } from '@angular/core';

import { HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService {

  constructor() { }

  intercept(request: HttpRequest < any > , next: HttpHandler): Observable < HttpEvent < any >> {
    if (sessionStorage.getItem('token')) {
      request = request.clone({
        setHeaders: {
          Authorization: 'Bearer ' + sessionStorage.getItem('token'),
        }
      });
    }

    return next.handle(request);
  }
}
