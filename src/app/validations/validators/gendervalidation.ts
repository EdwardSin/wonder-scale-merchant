import { FormControl } from '@angular/forms';

export class GenderValidation {
  static Valid(control: FormControl) {
    const gender = control.value;
    const errors = {};
    if (gender !== 'male' && gender !== 'female') {
      errors['Gender'] = true;
    }
    return errors;
  }
}
