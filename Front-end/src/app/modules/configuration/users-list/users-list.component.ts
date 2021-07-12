import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SweetalertService } from 'src/app/services/sweetalert.service';
import { UsersService } from 'src/app/services/users/users.service';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {

  public userId: number = null;

  public filter: any = {
    filtering: { },
    pager: {
      page: 1,
      limit: 10
    }
  };
  public users: Array<any> = [];
  public totalUsers: number = 0;

  public hospitals: Array<any> = [];
  public profiles: Array<any> = [];

  public permissions: any = {};
  public USER_MODULE: number = 3; 

  constructor(private router: Router,
              private swa: SweetalertService,
              private session: SessionService,
              private userService: UsersService) { }

  ngOnInit() {
    console.log('dentro de usuer')
    // this.permissions = this.session.getPermissions(this.USER_MODULE);
    this.userId = this.session.getUserId();
    this.getUsers();
  }

  getUsers() {
    console.log(this.filter);
    this.swa.loading('Obteniendo usuarios.');

    this.userService.listUsers(this.filter)
      .subscribe((data: any) => {
        this.swa.close();

        if (data && data.data) {
          this.totalUsers = data.count;
          this.users = data.data;
        }else {
          this.totalUsers = 0;
          this.users = [];
        }
      }, (error) => {
        this.swa.info(error.message, '');
      });
  }

  goToUsersForm(userId) {
  	this.router.navigate(['content', 'configuration', 'users-form', userId]);
  }

  deleteUser(userId) {
    this.swa.confirm('¿Deseas eliminar este usuario?', '' , (result) => {
      if(result.value){
        this.userService.deleteUser(userId)
          .subscribe((data: any) => {
            if (data.success) {
              this.swa.success('Usuario elimnado.', '', () => {
                this.getUsers();  
              });
            }else {
              this.swa.info(data.message);
            }
          }, (error) => {
            this.swa.info(error.message, '');
          });
      }
    });
  }


 
  alphaValidation(event){
    var regex = new RegExp(/^[a-zA-Z0-9@.\sÑñ]+$/i);
    var str = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (regex.test(str)) {
        return true;
    }

    event.preventDefault();
    return false;
  }

}
