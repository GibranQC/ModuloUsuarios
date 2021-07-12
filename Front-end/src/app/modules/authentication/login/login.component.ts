import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { SweetalertService } from 'src/app/services/sweetalert.service';
import { SessionService } from 'src/app/services/session.service';
import { LoginService } from 'src/app/services/login/login.service';

declare var CryptoJS: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public credentials: any = {};
  
  public emailPattern: any = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,5})+$/;

  constructor(private router: Router,
              private swa: SweetalertService,
              private session: SessionService,
              private loginService: LoginService) { }

  ngOnInit(){ 
    this.session.logout();
    console.log('entroo')
  }

  login(){  
    this.swa.loading('Validando usuario.');

    this.credentials.password = CryptoJS.SHA1(this.credentials.passwordEncrypt);
    this.credentials.password = CryptoJS.enc.Hex.stringify(this.credentials.password);

    //delete this.credentials.passwordEncrypt;

    this.loginService.login({ ...this.credentials })
      .subscribe((data: any) => {
        this.swa.close();
        if(data && data.success){
          this.session.login(data.user, data.token);
          this.router.navigate(['content', 'configuration', 'users-list']);          
        }else{
          console.log('salgo')
          this.swa.info(data.message, '');
        }
      }, (error) => {
        this.swa.info(error.message, '');
      }); 
  }

}
