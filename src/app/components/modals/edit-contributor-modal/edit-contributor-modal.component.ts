import { Component, OnInit, Input } from '@angular/core';
import { environment } from '@environments/environment';
import { Contributor } from '@objects/contributor';
import { AuthStoreAdminService } from '@services/http/auth-store/admin/auth-store-admin.service';
import { StoreAuthorizationService } from '@services/http/general/store-authorization.service';
import { SharedStoreService } from '@services/shared/shared-store.service';
import { SharedUserService } from '@services/shared/shared-user.service';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { WsToastService } from '@elements/ws-toast/ws-toast.service';
import _ from 'lodash';
import { finalize, takeUntil } from 'rxjs/operators';
import { WsModalComponent } from '@elements/ws-modal/ws-modal.component';
import { Subject } from 'rxjs';

@Component({
  selector: 'edit-contributor-modal',
  templateUrl: './edit-contributor-modal.component.html',
  styleUrls: ['./edit-contributor-modal.component.scss']
})
export class EditContributorModalComponent extends WsModalComponent implements OnInit {
  @Input() contributorController;
  user;
  isAdminAuthorized: Boolean;
  loading: WsLoading = new WsLoading;
  removeLoading: WsLoading = new WsLoading;
  environment = environment;
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(
    private authStoreAdminService: AuthStoreAdminService,
    private sharedStoreService: SharedStoreService,
    private storeAuthorizationService: StoreAuthorizationService,
    private sharedUserService: SharedUserService) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    this.sharedUserService.user.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        if (result) {
          this.user = result;
        }
      })
    this.storeAuthorizationService.isAdminAuthorized.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        this.isAdminAuthorized = result;
      })
  }
  ngOnDestroy() {
    super.ngOnDestroy();
  }
  editContributor() {
    if (this.contributorController.validate()) {
      let contributor: Contributor = Object.assign({}, this.contributorController.selectedContributor);
      contributor.role = this.contributorController.newRole;
      this.loading.start();
      this.authStoreAdminService.editContributor(contributor)
        .pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.loading.stop()))
        .subscribe(result => {
          this.contributorController.selectedContributor.role = this.contributorController.newRole;
          this.sharedStoreService.contributorRefresh.next(this.contributorController);
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
      user_id: this.contributorController.selectedContributor.user
    }
    this.removeLoading.start();
    this.authStoreAdminService.removeContributor(obj).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.removeLoading.stop())).subscribe(result => {
      this.sharedStoreService.refreshContributor.next(true);
      WsToastService.toastSubject.next({ content: "Contributor is removed!", type: 'success' });
      super.close();
    }, err => {
      WsToastService.toastSubject.next({ content: err.error, type: 'danger' });
    })
  }
}