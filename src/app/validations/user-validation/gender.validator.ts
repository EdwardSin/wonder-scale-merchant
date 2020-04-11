export class GenderValidator {
    errors: { gender: string }
    constructor(){
        this.errors = { gender : ""};
    }
    validate(genderController): boolean {
        if(genderController.errors){
            if(genderController.errors.required){
                this.errors.gender = "Please select a gender!";
            }
            return false;
        }
        return true;
    }
    reset(){
        this.errors.gender = "";
    }
}