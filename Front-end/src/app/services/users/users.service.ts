import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

    constructor(private http: HttpClient) { }

	private API: string = '';
    private API_SERVER: string = environment.server;
	
    createUser(user){
		delete user.passwordEncrypt;

	    return this.http
				.post(this.API_SERVER + '/private/users/save', user)
				.pipe(catchError(this.handleError));
    }

    updateUser(user){
		delete user.passwordEncrypt;

	    return this.http
				.post(this.API_SERVER + '/private/users/update', user)
				.pipe(catchError(this.handleError));
    }

    listUsers(params) {
    	return this.http
				.put(this.API_SERVER + '/private/users/list', params)
				.pipe(catchError(this.handleError));
    }

    getUserById(params) {
    	return this.http
				.get(this.API_SERVER + '/private/users/byId/' + params)
				.pipe(catchError(this.handleError));
    }

    deleteUser(params) {
    	return this.http
				.post(this.API_SERVER + '/private/users/delete' , { _id : params })
				.pipe(catchError(this.handleError));
    }

    private handleError(error: HttpErrorResponse) {
		if(error && error.status == 401)
			return throwError({ message: 'Tu sesión ha expirado o no tienes permisos para realizar esta acción.' });
		else if(error && error.status == 404)
			return throwError({ message: 'No se encontro el servicio solicitado' });
		else if(error && error.status == 500)
			return throwError({ message: 'Ocurrió un problema con el servidor.' });
		else
			return throwError(error);
	}
}
