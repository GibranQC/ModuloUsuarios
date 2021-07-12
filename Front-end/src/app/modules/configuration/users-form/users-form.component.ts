import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { SweetalertService } from 'src/app/services/sweetalert.service';
import { UsersService } from 'src/app/services/users/users.service';
import { SessionService } from 'src/app/services/session.service';

declare var CryptoJS: any;
declare var $: any;

@Component({
  selector: 'app-user-form',
  templateUrl: './users-form.component.html',
  styleUrls: ['./users-form.component.css']
})
export class UsersFormComponent implements OnInit {

  public userId: any = '';
  public userIdLogged: number = null;
  public user: any = {};
  
  public genders: Array<any> = [];
  public profiles: Array<any> = [];
  public allHospitals: Array<any> = [];
  public hospitals: Array<any> = [];
  public projects: Array<any> = [];

  public show: boolean = false;
  public lock: boolean = false;
  public multiple: boolean = false;
  public method: any = 'create';
  public emailPattern: any = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,5})+$/;
  public passPattern: any = /^(?=.{10,}$)(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*\W).*$/; // /^(?=.*\d)(?=.*[!¡¿?@#$&*=.,:-_+;])(?=.*[A-Z])(?=.*[a-z])\S{10,15}$/; // /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!¡%*+-_:.;,()¿?&#])([A-Za-z\d$@$!¡%*+-_:.;,()¿?&#]|[^ ]){10,15}$/;

  public permissions: any = {};
  public USER_MODULE: number = 3; 

  constructor(private swa: SweetalertService,
              private userService: UsersService,
              private session: SessionService,
              private router: Router,
              private route: ActivatedRoute) {}

  ngOnInit(): void {
    $('#inName').focus();
    // this.permissions = this.session.getPermissions(this.USER_MODULE);
    this.userIdLogged = this.session.getUserId();

    this.route.params
      .subscribe((params) => {
        if(params && params.id){
          this.method = 'update';
          this.lock = true;
          this.userId = params.id;
          this.getUserById();
        }
      });

    this.getGenders();
    this.getProfiles();
    this.getProjects();
    this.getAllHospitals();
  }

  getUserById() {
    this.userService.getUserById(this.userId)
      .subscribe((data: any) => {
        if (data.success) {
          this.user = data.response;
          this.getHospitals();
          this.validateProfile(false);
        } else {
          this.swa.info(data.message, '' );
        }
      }, (error) => {
        this.swa.info(error.message, '');
      });
  }

  createUser() {
    this.user.password = CryptoJS.SHA1(this.user.passwordEncrypt);
    this.user.password = CryptoJS.enc.Hex.stringify(this.user.password);
  	
  	this.swa.loading('Guardando usuario.');

  	 this.userService.createUser({ ...this.user })
      .subscribe((data: any) => {
        this.swa.close();
        if(data.success){
          this.swa.success('Usuario guardado.', '', () => {
            this.router.navigate(['content', 'configuration', 'users-list']);
          });
        } else {
          this.swa.info(data.message, '' );
        }
      }, (error) => {
        this.swa.info(error.message, '');
      });
  }

  updateUser() {
    if(this.user.passwordEncrypt){
      this.user.password = CryptoJS.SHA1(this.user.passwordEncrypt);
      this.user.password = CryptoJS.enc.Hex.stringify(this.user.password);
    }
    
    this.swa.loading('Actualizando usuario.');

     this.userService.updateUser(this.user)
      .subscribe((data: any) => {
        this.swa.close();
        if(data.success){
          this.swa.success('Usuario actualizado.', '', () => {
            this.router.navigate(['content', 'configuration', 'users-list']);
          });
        } else {
          this.swa.info(data.message, '' );
        }
      }, (error) => {
        this.swa.info(error.message, '');
      });
  }

  validateProfile(reset){
    if(reset){
      this.user.projects = [];
      this.user.hospitals = [];
      this.hospitals = [];
    }
    if(this.user.profile && this.user.profile.name == 'SUPERVISOR'){
      this.multiple = true;
      this.getHospitals();
    }else if(this.user.profile && (this.user.profile.name == 'ADMINISTRADOR' || this.user.profile.name == 'COORDINADOR')) {
      this.multiple = true;
      this.getHospitals();
      if(reset){
        this.user.hospitals = this.allHospitals;
        this.user.projects = this.projects;
      }
    }else{
      this.multiple = false;
    } 
  }

  cancelUser() {
    //this.swa.confirm('¿Estas seguro de cancelar?', 'Todos los cambios que realizaste se perderan.', (result) => {
      //if (result.value) {
        this.router.navigate(['content', 'configuration', 'users-list']);
      //}
    //});
  }

  getHospitals(){
    this.userService.getHospitals(this.userIdLogged, this.user.projects)
      .subscribe((data: any) => {
        console.log(data);
        this.hospitals = data.data;
      }, (error) => {
        this.swa.info(error.message, '');
      });
  }

  getAllHospitals(){
    this.userService.getHospitals(this.userIdLogged, [])
      .subscribe((data: any) => {
        console.log(data);
        this.allHospitals = data.data;
      }, (error) => {
        this.swa.info(error.message, '');
      });
  }

  getProfiles(){
    this.userService.getProfiles()
      .subscribe((data: any) => {
        console.log(data);
        this.profiles = data.data;
      }, (error) => {
        this.swa.info(error.message, '');
      });
  }

  getProjects(){
    this.userService.getProjects()
      .subscribe((data: any) => {
        console.log(data);
        this.projects = data.data;
      }, (error) => {
        this.swa.info(error.message, '');
      });
  }

  getGenders() {
    this.userService.getGenders()
      .subscribe((data: Array<any>) => {
        this.genders = data;
      }, (error) => {
        this.swa.info(error.message, '');
      });
  }

  alphaValidation(event){
    var regex = new RegExp(/^[a-zA-Z0-9\sÑñ]+$/i);
    var str = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (regex.test(str)) {
        return true;
    }

    event.preventDefault();
    return false;
  }

  textValidation(event){
    var regex = new RegExp(/^[a-zA-Z\sÑñ]+$/i);
    var str = String.fromCharCode(!event.charCode ? event.which : event.charCode);
    if (regex.test(str)) {
        return true;
    }

    event.preventDefault();
    return false;
  }

}
