import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Injectable({
    providedIn: 'root'
})
export class CustomValidators {

	min(control: AbstractControl, value: number): { [key: string]: boolean } {
		return control.value >= value ? null : { 'min': true };
	}

	max(control: AbstractControl, value: number): { [key: string]: boolean } {
		return control.value <= value ? null : { 'max': true };
	}

}