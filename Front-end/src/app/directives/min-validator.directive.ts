import { Directive, forwardRef, Input } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl } from '@angular/forms';
import { CustomValidators } from './customValidators';

@Directive({
	selector: '[minimum][formControlName],[minimum][formControl],[minimum][ngModel]',
	providers: [{
		provide: NG_VALIDATORS,
		useExisting: forwardRef(() => MinValidator),
		multi: true
	}]
})
export class MinValidator implements Validator {

	constructor(private validators: CustomValidators) { }
	
	@Input() minimum : number;

	validate(control: AbstractControl) {
		//console.log('Entra');
		return this.validators.min(control, this.minimum);
  	}
  
}