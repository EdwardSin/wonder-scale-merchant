import { URLValidator } from './../urlvalidator';
import { ValidatorInterface } from './../validator.interface';
export class WebsitesValidator implements ValidatorInterface {
    errors: {websites: { index: number, message: string} };
    constructor(){
        this.errors = { websites: { index: -1, message: ''} };
    }
    validate(websites): boolean {
        for (let i = 0; i < Object.keys(websites).length; i++) {
            if (i > 0 && (!websites['website-' + i] || (websites['website-' + i] && websites['website-' + i].trim() === ''))) {
              this.errors.websites.index = i;
              this.errors.websites.message = 'This is required!';
              return false;
            } else if (websites['website-' + i].trim() !== '' &&
              !URLValidator.validate(websites['website-' + i])
            ) {
              this.errors.websites.index = i;
              this.errors.websites.message = 'This website is not valid!';
              return false;
            }
            else if (websites['website-' + i].length > 30) {
              this.errors.websites.index = i;
              this.errors.websites.message = 'Website is too long!';
              return false;
            }
          }
          return true;
    }
    getValidatedValue(websites) {
        var websiteArray = [];
        for (let key of Object.keys(websites)) {
            if (websites[key] != '') {
                websiteArray.push(websites[key]);
            }
        }
        return websiteArray;
    }
    reset() {
        this.errors.websites.index = -1;
        this.errors.websites.message = "";
    }
}