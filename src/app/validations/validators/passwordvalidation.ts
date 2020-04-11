import { AbstractControl, FormControl } from '@angular/forms';

export class PasswordValidation {
    static MatchPassword(AC: AbstractControl) {
        const password = AC.get('password').value; // to get value in input tag
        const confirmPassword = AC.get('confirmPassword').value; // to get value in input tag
        if (password !== confirmPassword) {
            AC.get('confirmPassword').setErrors({ MatchPassword: true });
        } else {
            return;
        }
    }

    static PasswordPattern(control: FormControl) {
        const password = control.value;
        const errors = {};
        if (!PasswordValidation.ContainUppercase(password)) {
            errors['Uppercase'] = true;
        }
        if (!PasswordValidation.ContainDigit(password)) {
            errors['Digit'] = true;
        }
        return errors;
    }

    private static ContainUppercase(value) {
        const isUpperCase = string => /^[A-Z]*$/.test(string);
        value = value ? value : '';
        for (let i = 0; i < value.length; i++) {
            if (isUpperCase(value[i])) {
                return true;
            }
        }
        return false;
    }
    private static ContainDigit(value) {
        const isUpperCase = string => /^[0-9]*$/.test(string);
        value = value ? value : '';
        for (let i = 0; i < value.length; i++) {
            if (isUpperCase(value[i])) {
                return true;
            }
        }
        return false;
    }
}
