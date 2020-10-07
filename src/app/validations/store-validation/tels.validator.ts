import { ValidatorInterface } from './../validator.interface';

export class TelsValidator implements ValidatorInterface {
    errors: { tels: { index: number, message: string } };

    constructor() {
        this.errors = { tels: { index: -1, message: '' } };
    }
    validate(tels): boolean {
        for (let i = 0; i < Object.keys(tels).length; i++) {
            if (!tels['tel-' + i] || (tels['tel-' + i] && tels['tel-' + i].trim() === '')) {
                this.errors.tels.index = i;
                this.errors.tels.message = 'This is required!';
                return false;
            }
            else if (tels['tel-' + i].length > 20) {
                this.errors.tels.index = i;
                this.errors.tels.message = 'Tel is too long!';
                return false;
            }
        }
        return true;
    }
    getValidatedValue(tels) {
        var telArray = [];
        for (let key of Object.keys(tels)) {
            if (tels[key] != '') {
                telArray.push(tels[key]);
            }
        }
        return telArray;
    }

    reset() {
        this.errors.tels.index = -1;
        this.errors.tels.message = "";
    }
}