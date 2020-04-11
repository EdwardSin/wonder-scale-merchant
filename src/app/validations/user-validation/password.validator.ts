export class PasswordValidator {
  errors: { oldPassword: string, password: string, confirmPassword: string };
  constructor() {
    this.errors = { oldPassword: "", password: "", confirmPassword: "" };
  }
  validate(passwordController, confirmPasswordController, oldPasswordController?): boolean {

    if (oldPasswordController && oldPasswordController.errors && oldPasswordController.errors.required) {
      this.errors.oldPassword = "Please enter old password!";
      return false;
    }
    else if (passwordController.errors && passwordController.errors.required) {
      this.errors.password = "New password is required!";
      return false;
    }
    else if (
      passwordController.errors &&
      (passwordController.errors.minLength ||
        passwordController.errors.Uppercase ||
        passwordController.errors.Digit)
    ) {
      this.errors.password = "Password is not valid!";
      return false;
    }
    else if (
      confirmPasswordController.errors &&
      confirmPasswordController.errors.MatchPassword
    ) {
      this.errors.confirmPassword = "Password is not matched!";
      return false;
    }
    return true;
  }
  reset() {
    this.errors.password = "";
    this.errors.oldPassword = "";
    this.errors.confirmPassword = "";
  }
}