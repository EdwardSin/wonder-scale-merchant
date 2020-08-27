import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthCardContributorService } from '@services/http/auth-shop/contributor/auth-card-contributor.service';
import { SharedCardService } from '@services/shared/shared-card.service';
import { SharedShopService } from '@services/shared/shared-shop.service';
import { WsToastService } from '@wonderscale/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'modify-card',
  templateUrl: './modify-card.component.html',
  styleUrls: ['./modify-card.component.scss']
})
export class ModifyCardComponent implements OnInit {
  shop_id;
  year: number = 0;
  form: FormGroup;
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(private authCardContributorService: AuthCardContributorService,
    private route: ActivatedRoute,
    private router: Router,
    private sharedCardService: SharedCardService,
    private sharedShopService: SharedShopService) {
    this.form = this.createCardForm();
  }

  ngOnInit() {
  }
  createCardForm() {
    this.year = new Date().getFullYear();

    return new FormBuilder().group({
      card_number: ['', [Validators.required]],
      name: ['', [Validators.required]],
      csc: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
      month: ['', [Validators.required, Validators.maxLength(2), Validators.min(1), Validators.max(12)]],
      year: ['', [Validators.required, Validators.maxLength(4), Validators.min(this.year), Validators.max(this.year + 20)]],
      default: [true]
    })
  }
  addCard() {
    if (this.form.valid) {
      let obj = {
        ...this.form.value
      }
      this.authCardContributorService.addCard(obj)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(result => {
          this.getCardsByShopId();
          this.router.navigate(['', { outlets: { modal: '' } }]);
          WsToastService.toastSubject.next({ content: 'Card is added successfully!', type: 'success' });
        })
    }
    else {
      if (this.form.controls['card_number'].errors && this.form.controls['card_number'].errors.required) {
        WsToastService.toastSubject.next({ content: 'Card number is required!', type: 'danger' });
      }
      else if (this.form.controls['name'].errors && this.form.controls['name'].errors.required) {
        WsToastService.toastSubject.next({ content: 'Name is required!', type: 'danger' });
      }
      else if (this.form.controls['csc'].errors && this.form.controls['csc'].errors.required) {
        WsToastService.toastSubject.next({ content: 'CSC is required!', type: 'danger' });
      }
      else if (this.form.controls['csc'].errors &&
        (this.form.controls['csc'].errors.max || this.form.controls['csc'].errors.min)) {
        WsToastService.toastSubject.next({ content: 'CSC is not valid!', type: 'danger' });
      }
      else if (this.form.controls['month'].errors && this.form.controls['month'].errors.required) {
        WsToastService.toastSubject.next({ content: 'Month is required!', type: 'danger' });
      }
      else if (this.form.controls['month'].errors &&
        (this.form.controls['month'].errors.max || this.form.controls['month'].errors.min)) {
        WsToastService.toastSubject.next({ content: 'Month is not valid!', type: 'danger' });
      }
      else if (this.form.controls['year'].errors && this.form.controls['year'].errors.required) {
        WsToastService.toastSubject.next({ content: 'Year is required!', type: 'danger' });
      }
      else if (this.form.controls['year'].errors &&
        (this.form.controls['year'].errors.max || this.form.controls['year'].errors.min)) {
        WsToastService.toastSubject.next({ content: 'Year is not valid!', type: 'danger' });
      }
    }
  }

  getCardsByShopId() {
    this.authCardContributorService.getCardsByShopId().pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        this.sharedCardService.cards.next(result.result);
      })
  }
}
