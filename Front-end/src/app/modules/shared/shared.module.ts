import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MinValidator } from 'src/app/directives/min-validator.directive';

@NgModule({
  declarations: [
    MinValidator
  ],
  imports: [
    CommonModule
  ],
  exports: [
    MinValidator
  ]
})
export class SharedModule { }
