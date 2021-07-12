import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/services/session.service';

declare var $: any;

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  public screens: Array<any> = [];
  public routes: Array<any> = [
    {
      id: 0,
      name: 'Configuración',
      icon: 'fas fa-cogs',
      route: [ ],
      children: [
        {
          id: 3,
          name: 'Usuarios',
          icon: 'fas fa-users',
          route: ['content', 'configuration', 'users-list']
        }
      ]
    }
  ];

  constructor(private router: Router,
              private session: SessionService) { }

  ngOnInit() {
    this.session.isLoggedIn.subscribe((result) => {
      let loggedIn = result;
      if(loggedIn){
        let user = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')): {};
        
        this.screens = user.permissions;
        this.buildSidebar();
      }
    });
  }

  buildSidebar(){
    // ELIMINA LAS RUTAS DONDE LA PROPIEDAD GET == FALSE 
    for (let i = 0; i < this.routes.length; i++) {
      for (let j = 0; j < this.screens.length; j++) {
        // VALIDA RUTAS PADRES
        if(this.routes[i].id == this.screens[j].moduleId){
          for (let k = 0; k < this.screens[j].privileges.length; k++) {
            if(this.screens[j].privileges[k].method == 'get' && !this.screens[j].privileges[k].active){
              this.routes.splice(i, 1);
            }
          }
        }else if(this.routes[i].children && this.routes[i].children.length > 0){ 
          // VALIDA RUTAS HIJAS
          for (let k = 0; k < this.routes[i].children.length; k++) {
            if(this.routes[i].children[k].id == this.screens[j].moduleId){
              for (let l = 0; l < this.screens[j].privileges.length; l++) {
                if(this.screens[j].privileges[l].method == 'get' && !this.screens[j].privileges[l].active){
                  this.routes[i].children.splice(k, 1);
                }
              }
            }
          }
        }
      }
    }

    // ELIMINA LAS RUTAS CON ID == 0 (RUTAS DE AGRUPACIÓN) SI NO TIENEN RUTAS HIJAS
    let routesTmp = this.routes.filter((route) => {
      if(route.id != 0 || route.children.length > 0)
        return route
    });

    this.routes = routesTmp;

    if(!this.routes || this.routes.length == 0){
      this.session.logout();
      location.reload();
    }

    // ELIMINA LAS RUTAS CON ID == 0 (RUTAS DE AGRUPACIÓN) SI NO TIENEN RUTAS HIJAS
    /*
    for (let l = 0; l < this.routes.length; l++) {
      if(this.routes[l].id == 0 && this.routes[l].children.length == 0){
        this.routes.splice(l, 1);
      }
    }
    */
  }

  goToModule(route){
    if(!route) return;

    this.router.navigate(route);
    $('html').removeClass('nav-open');
    $('#overlaybg').removeClass('close-layer visible');
  }
}
