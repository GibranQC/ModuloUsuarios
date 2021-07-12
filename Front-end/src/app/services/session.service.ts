import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  public loggedIn = new BehaviorSubject<boolean>(false);
  
  constructor() { }

  get isLoggedIn() {
    let loggedIn = sessionStorage.getItem('loggedIn') == 'true' ? true: false;
    this.loggedIn.next(loggedIn);
    return this.loggedIn.asObservable();
  }

  login(user, token) {
    sessionStorage.setItem('loggedIn', 'true');
    sessionStorage.setItem('user', JSON.stringify(user));
    sessionStorage.setItem('token', token);

    this.loggedIn.next(true);
  }

  logout(){
    sessionStorage.clear();
    sessionStorage.setItem('loggedIn', 'false');

    this.loggedIn.next(false);
  }

  getUserId(){
    let user = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')): {};
        
    return user._id;
  }

//   getPermissions(moduleId){
//     let user = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')): {};
//     let permissions = user.permissions ? user.permissions: [];
//     let permission: any = {}

//     for (let i = 0; i < permissions.length; i++) {
//       if(permissions[i].moduleId == moduleId){
//         for (let j = 0; j < permissions[i].privileges.length; j++) {
//           permission[permissions[i].privileges[j].method] = permissions[i].privileges[j].active;
          
//         }
//       }
//     }
    
//     return permission;
//   }
 }
