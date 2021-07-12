import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { NgSelectModule } from '@ng-select/ng-select';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { CarouselModule } from 'ngx-bootstrap/carousel';

import { ConfigurationRoutingModule } from './configuration-routing.module';

import { UsersListComponent } from './users-list/users-list.component';
import { UsersFormComponent } from './users-form/users-form.component';
import { ProfilesComponent } from './profiles/profiles.component';


 

@NgModule({
  declarations: [
    UsersListComponent, 
    UsersFormComponent, 
    ProfilesComponent
  ],
  imports: [
    CommonModule,
    ConfigurationRoutingModule,
    FormsModule,
    NgSelectModule,
    PaginationModule.forRoot(),
    CarouselModule.forRoot()
  ]
})
export class ConfigurationModule { }
