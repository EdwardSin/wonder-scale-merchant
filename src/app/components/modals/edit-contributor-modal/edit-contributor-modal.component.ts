import { Component, ElementRef, OnInit } from '@angular/core';
import { environment } from '@environments/environment';
import { Contributor } from '@objects/contributor';
import { ContributorController } from '@objects/contributor.controller';
import { AuthShopAdminService } from '@services/http/auth-shop/admin/auth-shop-admin.service';
import { ShopAuthorizationService } from '@services/http/general/shop-authorization.service';
import { SharedShopService } from '@services/shared/shared-shop.service';
import { SharedUserService } from '@services/shared/shared-user.service';
import { WsLoading } from '@components/elements/ws-loading/ws-loading';
import { WsModalClass } from '@components/elements/ws-modal/ws-modal';
import { WsModalService } from '@components/elements/ws-modal/ws-modal.service';
import { WsToastService } from '@components/elements/ws-toast/ws-toast.service';
import _ from 'lodash';
import { finalize, takeUntil } from 'rxjs/operators';
import { Role } from '@enum/Role.enum';

@Component({
  selector: 'edit-contributor-modal',
  templateUrl: './edit-contributor-modal.component.html',
  styleUrls: ['./edit-contributor-modal.component.scss']
})
export class EditContributorModalComponent extends WsModalClass implements OnInit {
  user;
  isAdminAuthorized: Boolean;
  loading: WsLoading = new WsLoading;
  removeLoading: WsLoading = new WsLoading;
  contributorController: ContributorController = new ContributorController;
  environment = environment;
  constructor(modalService: WsModalService,
    private authShopAdminService: AuthShopAdminService,
    private sharedShopService: SharedShopService,
    private shopAuthorizationService: ShopAuthorizationService,
    private sharedUserService: SharedUserService, el: ElementRef) {
    super(modalService, el);
  }

  ngOnInit() {
    super.ngOnInit();
    this.sharedUserService.user.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        if (result) {
          this.user = result;
        }
      })
    this.shopAuthorizationService.isAdminAuthorized.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        this.isAdminAuthorized = result;
      })
  }
  ngOnDestroy() {
    super.ngOnDestroy();
  }
  setElement(element) {
    super.setElement(element);
    this.contributorController = _.clone(element);
  }
  editContributor() {
    if (this.contributorController.validate()) {
      let contributor: Contributor = Object.assign({}, this.contributorController.selectedContributor);
      contributor.role = this.contributorController.newRole;
      this.loading.start();
      this.authShopAdminService.editContributor(contributor)
        .pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.loading.stop()))
        .subscribe(result => {
          this.contributorController.selectedContributor.role = this.contributorController.newRole;
          this.sharedShopService.contributorRefresh.next(this.contributorController);
          WsToastService.toastSubject.next({ content: 'Contributor is updated!', type: 'success' });
          super.close();
        }, (err) => {
          WsToastService.toastSubject.next({ content: err.error, type: 'danger' });
        });
    }
    else {
      WsToastService.toastSubject.next({ content: this.contributorController.errors.contributor, type: 'danger' });
    }
  }
  removeContributor() {
    let obj = {
      contributor: this.contributorController.selectedContributor
    }
    this.removeLoading.start();
    this.authShopAdminService.removeContributor(obj).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.removeLoading.stop())).subscribe(result => {
      this.sharedShopService.refreshContributor.next(true);
      WsToastService.toastSubject.next({ content: "Contributor is removed!", type: 'success' });
      super.close();
    }, err => {
      WsToastService.toastSubject.next({ content: err.error, type: 'danger' });
    })
  }
}