import { FormControl } from '@angular/forms';

export class TelValidation {
    static PatternMatching(control: FormControl) {
        const tel = control.value;
        const errors = {};
        // var regex = /^(?:[0-9] ?){6,14}[0-9]$/;
        // var regex = /^[(]{0,1}[0-9]{3}[)\.\- ]{0,1}[0-9]{3}[\.\- ]{0,1}[0-9]{4}$/;
        const regex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
        if (!regex.test(tel)) {
            errors['PatternMatching'] = true;
        }
        return errors;
    }
}
