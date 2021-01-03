import { AbstractControl, FormControl } from '@angular/forms';

export class AddressValidation {
    static validAddress(AC: AbstractControl) {
        const address = AC.get('address').value; // to get value in input tag
        const postcode = AC.get('postcode').value; // to get value in input tag
        const state = AC.get('state').value; // to get value in input tag
        const country = AC.get('country').value; // to get value in input tag
        if (address && (!postcode || !state || !country)) {
            AC.get('postcode').setErrors({ empty: true });
            AC.get('state').setErrors({ empty: true });
            AC.get('country').setErrors({ empty: true });
        } else if (postcode && (!address || !state || !country)) {
            AC.get('address').setErrors({ empty: true });
            AC.get('state').setErrors({ empty: true });
            AC.get('country').setErrors({ empty: true });
        } else if (state && (!postcode || !address || !country)) {
            AC.get('address').setErrors({ empty: true });
            AC.get('postcode').setErrors({ empty: true });
            AC.get('country').setErrors({ empty: true });
        } else if (country && (!postcode || !state || !address)) {
            AC.get('postcode').setErrors({ empty: true });
            AC.get('state').setErrors({ empty: true });
            AC.get('address').setErrors({ empty: true });
        } else {
            AC.get('address').setErrors(null);
            AC.get('postcode').setErrors(null);
            AC.get('state').setErrors(null);
            AC.get('country').setErrors(null);
            return;
        }
    }
    static validAddressWithoutCountry(AC: AbstractControl) {
        const address = AC.get('address').value; // to get value in input tag
        const postcode = AC.get('postcode').value; // to get value in input tag
        const state = AC.get('state').value; // to get value in input tag
        if (address && (!postcode || !state)) {
            AC.get('postcode').setErrors({ empty: true });
            AC.get('state').setErrors({ empty: true });
        } else if (postcode && (!address || !state)) {
            AC.get('address').setErrors({ empty: true });
            AC.get('state').setErrors({ empty: true });
        } else if (state && (!postcode || !address)) {
            AC.get('address').setErrors({ empty: true });
            AC.get('postcode').setErrors({ empty: true });
        } else {
            AC.get('address').setErrors(null);
            AC.get('postcode').setErrors(null);
            AC.get('state').setErrors(null);
            return;
        }
    }
}