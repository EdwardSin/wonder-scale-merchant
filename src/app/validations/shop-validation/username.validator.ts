import { ValidatorInterface } from './../validator.interface';
export class UsernameValidator implements ValidatorInterface {
    errors: { username: string };

    constructor() {
        this.errors = { username: "" };
    }
    validate(usernameController): boolean {
        if (usernameController.errors && usernameController.errors.required) {
            this.errors.username = 'Username is required!';
            return false;
        }

        return true;
    }
    reset() {
        this.errors.username = "";
    }
}