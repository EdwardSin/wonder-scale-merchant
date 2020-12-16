import { AbstractControl, FormControl } from '@angular/forms';

export class AddressValidation {
    static validAddress(AC: AbstractControl) {
        const address = AC.get('address').value; // to get value in input tag
        const postCode = AC.get('postCode').value; // to get value in input tag
        const state = AC.get('state').value; // to get value in input tag
        const country = AC.get('country').value; // to get value in input tag
        if (address && (!postCode || !state || !country)) {
            AC.get('postCode').setErrors({ empty: true });
            AC.get('state').setErrors({ empty: true });
            AC.get('country').setErrors({ empty: true });
        } else if (postCode && (!address || !state || !country)) {
            AC.get('address').setErrors({ empty: true });
            AC.get('state').setErrors({ empty: true });
            AC.get('country').setErrors({ empty: true });
        } else if (state && (!postCode || !address || !country)) {
            AC.get('address').setErrors({ empty: true });
            AC.get('postCode').setErrors({ empty: true });
            AC.get('country').setErrors({ empty: true });
        } else if (country && (!postCode || !state || !address)) {
            AC.get('postCode').setErrors({ empty: true });
            AC.get('state').setErrors({ empty: true });
            AC.get('address').setErrors({ empty: true });
        } else {
            AC.get('address').setErrors(null);
            AC.get('postCode').setErrors(null);
            AC.get('state').setErrors(null);
            AC.get('country').setErrors(null);
            return;
        }
    }
}