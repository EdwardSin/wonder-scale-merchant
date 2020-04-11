export class EmailValidator{
    errors: { email: string }
    constructor(){
        this.errors = { email : ""};
    }
    validate(emailController): boolean{
        if(emailController.errors){
            if(emailController.errors.required){
                this.errors.email = "Email is required!";
            }
            else if(emailController.errors.email){
                this.errors.email = "Please enter a valid email!";
            }
            else if(emailController.errors.maxlength){
                this.errors.email = "Email is too long!";
            }
            return false;
        }

        return true;
    }
    reset(){
        this.errors.email = "";
    }
}