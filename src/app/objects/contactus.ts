import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Constants } from "../constants/constants";

export class Contactus {
    form: FormGroup;
    error = {
        name: '',
        email: '',
        tel: '',
        country: '',
        comment: '',
        message: ''
    };
    data = {
        countries: Constants.countries,
        keys: Object.keys(Constants.countries)
    }
    input;


    constructor() {
        let formBuilder = new FormBuilder;
        this.form = formBuilder.group({
            name: ["", [Validators.required]],
            email: ["", [Validators.required, Validators.email]],
            tel: ["", [Validators.required]],
            country: ["", [Validators.required]],
            comment: ["", [Validators.required, Validators.minLength(15)]]
        })
    }

    validate() {
        let name = this.form.get("name");
        let email = this.form.get("email");
        let tel = this.form.get("tel");
        let country = this.form.get("country");
        let comment = this.form.get("comment");
        this.error = {
            name: '',
            email: '',
            tel: '',
            country: '',
            comment: '',
            message: ''
        };

        if (name.errors && name.errors.required) {
            this.error.name = "Name is required.";
            return false;
        }
        else if (email.errors && email.errors.required) {
            this.error.email = "Email is required.";
            return false;
        }
        else if (email.errors && email.errors.email) {
            this.error.email = "Email is invalid.";
            return false;
        }
        else if (tel.errors && tel.errors.required) {
            this.error.tel = "Tel is required.";
            return false;
        }
        else if (country.errors && country.errors.required) {
            this.error.country = "Country is required.";
            return false;
        }
        else if (comment.errors && comment.errors.required) {
            this.error.comment = "Comment is required.";
            return false;
        }
        else if (comment.errors && comment.errors.minlength) {
            this.error.comment = "At least 15 characters is entered.";
            return false;
        }
        return true;
    }

    reset() {
        this.form.get('name').setValue("");
        this.form.get('email').setValue("");
        this.form.get('tel').setValue("");
        this.form.get('country').setValue("");
        this.form.get('comment').setValue("");
    }
}