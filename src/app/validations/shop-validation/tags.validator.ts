import { ValidatorInterface } from './../validator.interface';

export class TagsValidator implements ValidatorInterface{
    errors: { tag: string }
    constructor(){
        this.errors = { tag: "" };
    }
    validate(): boolean{
        return true;
    }
    reset(){
        this.errors.tag = "";
    }
}