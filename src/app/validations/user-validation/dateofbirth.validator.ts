export class DateOfBirthValidator {
    errors: { dateOfBirth: string }
    constructor() {
        this.errors = { dateOfBirth: "" };
    }
    validate(dateController, monthController, yearController): boolean {
        if (!dateController.value || dateController.errors && dateController.errors.ValidDate ||
            !monthController.value || !yearController.value) {
            this.errors.dateOfBirth = "Please enter a valid date!";
            return false;
        }
        return true;
    }
    reset() {
        this.errors.dateOfBirth = "";
    }
}