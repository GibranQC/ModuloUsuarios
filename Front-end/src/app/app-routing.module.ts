import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import(`./modules/authentication/authentication.module`).then(m => m.AuthenticationModule)
  },
  
  {
    path : '**', 
    pathMatch : 'full',
    redirectTo : 'login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
