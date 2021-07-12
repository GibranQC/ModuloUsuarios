import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsersListComponent } from './users-list/users-list.component';
import { UsersFormComponent } from './users-form/users-form.component';

import { AuthguardService } from 'src/app/services/authguard.service';

const routes: Routes = [
  { path: 'users-list', component: UsersListComponent},
  { path: 'users-form', component: UsersFormComponent, canActivate: [ AuthguardService ] },
  { path: 'users-form/:id', component: UsersFormComponent, canActivate: [ AuthguardService ] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigurationRoutingModule { }
