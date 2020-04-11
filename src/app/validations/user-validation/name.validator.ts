export class NameValidator {
  errors: { firstName: string, lastName: string };
  constructor() {
    this.errors = { firstName: "", lastName: "" };
  }
  validate(firstName, lastName): boolean {
    if (firstName.errors) {
      if (firstName.errors.required) {
        this.errors.firstName = "First name is required!";
      }
      else if (firstName.errors.maxlength) {
        this.errors.firstName = "First name is too long!";
      }
      return false;
    }
    else if (lastName.errors) {
      if (lastName.errors.required) {
        this.errors.lastName = "Last name is required!";
      }
      else if (lastName.errors.maxlength) {
        this.errors.lastName = "Last name is too long!";
      }
      return false;
    }
    return true;
  }
  reset() {
    this.errors.firstName = "";
    this.errors.lastName = "";
  }
}