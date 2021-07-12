import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfilesService {

	private API: string = environment.api;
	private API_SERVER: string = environment.server

    constructor(private http: HttpClient) { }

    getProfiles(params) {
		return this.http
			.post(this.API_SERVER + '/private/profiles/list', params)
            .pipe(
                map((profile: Array<any>) => {
                
                    for (let i = 0; i < profile.length; i++) {
                        for (let j = 0; j < profile[i].permissions.length; j++) {
                            profile[i].permissions[j].isSelected = true;
                            for (let k = 0; k < profile[i].permissions[j].privileges.length; k++) {
                                if(!profile[i].permissions[j].privileges[k].active){
                                    profile[i].permissions[j].isSelected = false;
                                    break;
                                }
                            }
                        }
                    }

                    return profile;
                }), 
                catchError(this.handleError));
    }
    
    createProfile(data){
        return this.http
			.post(this.API_SERVER + '/private/profiles/save', data)
            .pipe(catchError(this.handleError));
    }

    updateProfile(data){
        return this.http
			.post(this.API_SERVER + '/private/profiles/update', data)
            .pipe(catchError(this.handleError));
    }

    initProfile(){
        return this.http
			.get(this.API_SERVER + '/private/modules/list', {})
            .pipe(catchError(this.handleError));
    }

    
    getOldProfiles(){
        return  [{
            "name": "",
            "description": "",
            "permissions": [
                {
                    "moduleId": 1,
                    "module": "Procedimientos",
                    "isSelected": false,
                    "privileges": [
                        {
                            "name": "Listado de procedimientos",
                            "active": true,
                            "method": "get"
                        },
                        {
                            "name": "Creación de un nuevo procedimiento",
                            "active": true,
                            "method": "create"
                        },
                        {
                            "name": "Actualización de un procedimiento",
                            "active": true,
                            "method": "update"
                        },
                    ]
                },
                {
                    "moduleId": 2,
                    "module": "Insumos",
                    "isSelected": false,
                    "privileges": [
                        {
                            "name": "Listado de insumos",
                            "active": true,
                            "method": "get"
                        },
                        {
                            "name": "Creación de un nuevo insumo",
                            "active": false,
                            "method": "create"
                        },
                        {
                            "name": "Actualización de un insumo",
                            "active": true,
                            "method": "update"
                        }
                    ]
                },
                {
                    "moduleId": 3,
                    "module": "Usuarios",
                    "isSelected": false,
                    "privileges": [
                        {
                            "name": "Listado de usuarios",
                            "active": true,
                            "method": "get"
                        }
                        
                    ]
                },
            ]
        }]
    }

    getModules(){
        return [
                    {
                        "moduleId": 1,
                        "module": "Procedimientos",
                        "isSelected": false,
                        "privileges": [
                            {
                                "name": "Listado de procedimientos",
                                "active": false,
                                "method": "get"
                            },
                            {
                                "name": "Creación de un nuevo procedimiento",
                                "active": false,
                                "method": "create"
                            },
                            {
                                "name": "Actualización de un procedimiento",
                                "active": false,
                                "method": "update"
                            },
                            {
                                "name": "Cancelación de un procedimiento",
                                "active": false,
                                "method": "delete"
                            },
                            {
                                "name": "Registro de una incidencia",
                                "active": false,
                                "method": "createIncidence"
                            }
                        ]
                    },
                    {
                        "moduleId": 2,
                        "module": "Insumos",
                        "isSelected": false,
                        "privileges": [
                            {
                                "name": "Listado de insumos",
                                "active": false,
                                "method": "get"
                            },
                            {
                                "name": "Creación de un nuevo insumo",
                                "active": false,
                                "method": "create"
                            },
                            {
                                "name": "Actualización de un insumo",
                                "active": false,
                                "method": "update"
                            },
                            {
                                "name": "Eliminación de un insumo",
                                "active": false,
                                "method": "delete"
                            }
                        ]
                    },
                    {
                        "moduleId": 3,
                        "module": "Usuarios",
                        "isSelected": false,
                        "privileges": [
                            {
                                "name": "Listado de usuarios",
                                "active": false,
                                "method": "get"
                            },
                            {
                                "name": "Creación de un nuevo usuario",
                                "active": false,
                                "method": "create"
                            },
                            {
                                "name": "Actualización de un usuario",
                                "active": false,
                                "method": "update"
                            },
                            {
                                "name": "Eliminación de un usuario",
                                "active": false,
                                "method": "delete"
                            }
                        ]
                    },
                    {
                        "moduleId": 4,
                        "module": "Perfiles",
                        "isSelected": false,
                        "privileges": [
                            {
                                "name": "Listado de perfiles",
                                "active": false,
                                "method": "get"
                            },
                            {
                                "name": "Creación de un nuevo perfil",
                                "active": false,
                                "method": "create"
                            },
                            {
                                "name": "Actualización de un perfil",
                                "active": false,
                                "method": "update"
                            },
                            {
                                "name": "Eliminación de un perfil",
                                "active": false,
                                "method": "delete"
                            }
                        ]
                    }
                ]
            
    }

	private handleError(error: HttpErrorResponse) {
		if (error && error.status == 401)
			return throwError({ message: 'Tu sesión ha expirado o no tienes permisos para realizar esta acción.' });
		else if (error && error.status == 404)
			return throwError({ message: 'No se encontro el servicio solicitado' });
		else if (error && error.status == 500)
			return throwError({ message: 'Ocurrió un problema con el servidor.' });
		else
			return throwError(error);
	}
  
}
