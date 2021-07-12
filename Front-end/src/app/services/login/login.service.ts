import { Injectable } from '@angular/core';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  
	private API: string = environment.api;
	private API_SERVER: string = environment.server;

	constructor(private http: HttpClient) { }

  login(data) {
		delete data.passwordEncrypt;

		return this.http
				.post(this.API_SERVER + '/private/login', data)
				.pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
  		console.log(error)
		if(error && error.status == 401)
			return throwError({ message: 'Tu sesión ha expirado o no tienes permisos para realizar esta acción.' });
		else if(error && error.status == 404)
			return throwError({ message: 'No se encontro el servicio solicitado' });
		else if(error && error.status == 500)
			return throwError({ message: 'Inicio de sesión fallido.' });
		else
			return throwError(error);
	}
}
