import { ValidatorInterface } from './../validator.interface';
import { EmailValidator } from '../email.validator';
export class EmailsValidator implements ValidatorInterface{
    errors: { email: { index: number, message: string }}

    constructor(){
        this.errors = { email: { index: -1, message: ''} };
    }
    validate(emails){
      for (let i = 0; i < Object.keys(emails).length; i++) {
        if (!emails['email-' + i] || (emails['email-' + i] && emails['email-' + i].trim() === '')) {
          this.errors.email.index = i;
          this.errors.email.message = 'This is required!';
          return false;
        } else if (emails['email-' + i].trim() !== '' && !EmailValidator.validate(emails['email-' + i])) {
          this.errors.email.index = i;
          this.errors.email.message = 'This email is not valid!';
          return false;
        }
        else if (emails['email-' + i].length > 50) {
          this.errors.email.index = i;
          this.errors.email.message = 'Email is too long!';
          return false;
        }
      }
      return true;
    }
    getValidatedValue(emails) {
        var emailArray = [];
        for (let key of Object.keys(emails)) {
            if (emails[key] != '') {
                emailArray.push(emails[key]);
            }
        }
        return emailArray;
    }
    reset(){
        this.errors.email.index = -1;
        this.errors.email.message = '';
    }
}