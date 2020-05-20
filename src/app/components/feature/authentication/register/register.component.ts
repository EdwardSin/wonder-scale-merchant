import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DateBuilder } from '@builders/date.builder';
import { WSFormBuilder } from '@builders/wsformbuilder';
import { environment } from '@environments/environment';
import { AuthenticationService } from '@services/http/general/authentication.service';
import { UserService } from '@services/http/general/user.service';
import { DateOfBirthValidator } from '@validations/user-validation/dateofbirth.validator';
import { EmailValidator } from '@validations/user-validation/email.validator';
import { GenderValidator } from '@validations/user-validation/gender.validator';
import { NameValidator } from '@validations/user-validation/name.validator';
import { PasswordValidator } from '@validations/user-validation/password.validator';
import { TelValidator } from '@validations/user-validation/tel.validator';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { WsToastService } from '@elements/ws-toast/ws-toast.service';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RegisterComponent implements OnInit {
  registerSuccess: boolean = false;

  registerForm;
  dateSelector = DateBuilder.getDateSelector();
  emailValidator = new EmailValidator;
  nameValidator = new NameValidator;
  genderValidator = new GenderValidator;
  telValidator = new TelValidator;
  passwordValidator = new PasswordValidator;
  dateOfBirthValidator = new DateOfBirthValidator;
  loading: WsLoading = new WsLoading;

  private ngUnsubscribe: Subject<any> = new Subject;
  environment = environment;
  constructor(private userService: UserService) {
    this.setupRegisterForm();
  }
  ngOnInit() {
  }
  register() {
    var form = this.registerForm;
    this.reset();
    if (this.isValidated()) {
      let date = moment(form.value.date + "/" + form.value.month + "/" + form.value.year, 'DD/MMM/YYYY').toDate();
      let newUser = {
        firstName: form.value.firstName,
        lastName: form.value.lastName,
        dateOfBirth: date,
        gender: form.value.gender,
        tel: form.value.tel,
        password: form.value.passwordGroup.password,
        confirmPassword: form.value.passwordGroup.confirmPassword,
        email: form.value.email,
        receiveInfo: form.value.receiveInfo ? true : false
      };
      this.loading.start();
      this.userService.addUser(newUser)
        .pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.loading.stop()))
        .subscribe(result => {
          this.registerSuccess = true;
          this.registerForm.reset();
        }, (err) => {
          WsToastService.toastSubject.next({ content: err.error.message, type: 'danger' });
        })
    }
  }
  resendActiveLink() {
    this.userService.resendActivationEmailConfirmation({ email: this.registerForm.value.email, password: this.registerForm.value.passwordGroup.password }).subscribe(result => {
      this.userService.resendActivationEmail(this.registerForm.value.email).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
        WsToastService.toastSubject.next({ content: "Activation Email is sent!", type: 'danger' });
      });
    });
  }
  setupRegisterForm() {
    this.registerForm = WSFormBuilder.createRegisterForm();
  }
  isValidated() {
    let emailController = this.registerForm.get('email');
    let firstNameController = this.registerForm.get('firstName');
    let lastNameController = this.registerForm.get('lastName');
    let telController = this.registerForm.get('tel');
    let genderController = this.registerForm.get('gender');
    let passwordController = this.registerForm.get('passwordGroup').get('password');
    let confirmPasswordController = this.registerForm.get('passwordGroup').get('confirmPassword');
    let dateController = this.registerForm.get('date');
    let monthController = this.registerForm.get('month');
    let yearController = this.registerForm.get('year');

    if (!this.nameValidator.validate(firstNameController, lastNameController)) {
      if (this.nameValidator.errors.firstName) {
        WsToastService.toastSubject.next({ content: this.nameValidator.errors.firstName, type: 'danger' });
      }
      else {
        WsToastService.toastSubject.next({ content: this.nameValidator.errors.lastName, type: 'danger' });
      }
      return;
    }
    else if (!this.emailValidator.validate(emailController)) {
      WsToastService.toastSubject.next({ content: this.emailValidator.errors.email, type: 'danger' });
      return;
    }
    else if (!this.telValidator.validate(telController)) {
      WsToastService.toastSubject.next({ content: this.telValidator.errors.tel, type: 'danger' });
      return;
    }
    else if (!this.genderValidator.validate(genderController)) {
      WsToastService.toastSubject.next({ content: this.genderValidator.errors.gender, type: 'danger' });
      return;
    }
    else if (!this.passwordValidator.validate(passwordController, confirmPasswordController)) {
      if (this.passwordValidator.errors.password) {
        WsToastService.toastSubject.next({ content: this.passwordValidator.errors.password, type: 'danger' });
      }
      else {
        WsToastService.toastSubject.next({ content: this.passwordValidator.errors.confirmPassword, type: 'danger' });
      }
      return;
    }
    else if (!this.dateOfBirthValidator.validate(dateController, monthController, yearController)) {
      WsToastService.toastSubject.next({ content: this.dateOfBirthValidator.errors.dateOfBirth, type: 'danger' });
      return;
    }
    return true;

  }
  reset() {
    this.emailValidator.reset();
    this.nameValidator.reset();
    this.genderValidator.reset();
    this.dateOfBirthValidator.reset();
    this.passwordValidator.reset();
    this.telValidator.reset();
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
  get password() { return this.registerForm.get("passwordGroup").get("password"); }
}
