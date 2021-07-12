import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

// ANGULAR MODULES
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// EXTERNAL MODULES
import { FormsModule } from '@angular/forms';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';

// SERVICES
import { InterceptorService } from './services/interceptor.service';
import { SweetalertService } from './services/sweetalert.service';
import { SessionService } from './services/session.service';
import { AuthguardService } from './services/authguard.service';

// MAIN ROUTER
import { AppRoutingModule } from './app-routing.module';

// MAIN COMPONENT
import { AppComponent } from './app.component';
import { SharedModule } from './modules/shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    NgxMaterialTimepickerModule,
    AppRoutingModule,
    SharedModule
  ],
  providers: [
    SweetalertService,
    SessionService,
    AuthguardService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
