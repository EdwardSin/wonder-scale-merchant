export class TelValidator{
    errors: { tel: string}
    constructor(){
        this.errors = { tel : ""};
    }
    validate(telController): boolean{
        if(telController.errors){
            if(telController.errors.required){
                this.errors.tel = "Tel is required!";
            }
            else if(telController.errors.maxlength){
                this.errors.tel = "Tel is too long!";
            }
            return false;
        }
        return true;
    }
    reset(){
        this.errors.tel = "";
    }
}