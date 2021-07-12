import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  public loggedIn: boolean = false;

  @Input() name: string = '';
  @Input() profile: string = '';

  constructor(private router: Router,
              private session: SessionService) { }

  ngOnInit() {
    
  }

  logout(){
    this.session.logout();
    this.router.navigate(['login']);
  }

}
