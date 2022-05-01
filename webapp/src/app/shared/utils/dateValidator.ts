import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import * as moment from "moment";

export function dateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
      const input = moment(control.value, 'yyyy-MM-dd');
      const today = moment();
      const minDate = moment().subtract('120', 'y');
      
      if(input.isAfter(today) || input.isBefore(minDate)) return {invalidDate: control.value}
      return null;
    };
  }