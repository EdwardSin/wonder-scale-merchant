import { Component, OnInit } from '@angular/core';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { WsToastService } from '@elements/ws-toast/ws-toast.service';
import { Role } from '@enum/Role.enum';
import { environment } from '@environments/environment';
import { ContributorController } from '@objects/contributor.controller';
import { Store } from '@objects/store';
import { AuthStoreContributorService } from '@services/http/auth-store/contributor/auth-store-contributor.service';
import { StoreAuthorizationService } from '@services/http/general/store-authorization.service';
import { SharedStoreService } from '@services/shared/shared-store.service';
import { SharedUserService } from '@services/shared/shared-user.service';
import { forkJoin, Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import _ from 'lodash';
import { AuthStoreAdminService } from '@services/http/auth-store/admin/auth-store-admin.service';
import { Contributor } from '@objects/contributor';
import { DocumentHelper } from '@helpers/documenthelper/document.helper';

@Component({
  selector: 'app-staff-settings',
  templateUrl: './staff-settings.component.html',
  styleUrls: ['./staff-settings.component.scss']
})
export class StaffSettingsComponent implements OnInit {
  isMobileSize: boolean;
  isAdminAuthorized: boolean;
  isEditContributorModalOpened: boolean;
  store: Store;
  userSuggestions = [];
  environment = environment;
  valueChanged = _.debounce((value) => this.searchContributors(value), 300);
  loading: WsLoading = new WsLoading;
  refreshLoading: WsLoading = new WsLoading;
  isInviteLoading: WsLoading = new WsLoading;
  contributorController: ContributorController = new ContributorController;
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(private storeAuthorizationService: StoreAuthorizationService,
    private sharedUserService: SharedUserService,
    private authStoreContributorService: AuthStoreContributorService,
    private authStoreAdminService: AuthStoreAdminService,
    private sharedStoreService: SharedStoreService) { 
    this.sharedStoreService.store.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.store = result;
      DocumentHelper.setWindowTitleWithWonderScale('Staff - ' + this.store.name);
      this.updateContributorAuthorization();
    });
    this.sharedStoreService.contributorRefresh.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        if (result) {
          this.contributorController = result;
          this.updateContributorAuthorization();
        }
      })
  }

  ngOnInit(): void {
    this.loading.start();
    this.storeAuthorizationService.isAdminAuthorized.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        this.isAdminAuthorized = result;
    })
  }
  updateContributorAuthorization() {
    let contributors = this.contributorController.existsContributors;
    let user = this.sharedUserService.user.value;
    let contributor = contributors.find(contributor => contributor['user'] == user._id && contributor.role == Role.Admin);
    this.storeAuthorizationService.isAdminAuthorized.next(contributor != null);
    this.loading.stop();
  }
  getContributors() {
    this.refreshLoading.start();
    this.authStoreContributorService.getContributors().pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.refreshLoading.stop()))
      .subscribe(result => {
        this.contributorController.existsContributors = result['result'];
        this.sharedStoreService.contributorRefresh.next(this.contributorController);
        this.updateContributorAuthorization();
      }, err => {
        WsToastService.toastSubject.next({ content: err.error, type: 'danger' });
      })
  }
  addContributor(user) {
    this.userSuggestions = [];
    this.contributorController.searchText = '';
    if (_.find(this.contributorController.existsContributors, (x) => x.email == user.email)) {
      WsToastService.toastSubject.next({ content: "User is already a contributor!", type: 'danger' });
    }
    else if (_.find(this.contributorController.newContributors, (x) => x.email == user.email)) {
      WsToastService.toastSubject.next({ content: "User has been added!", type: 'danger' });
    }
    else {
      this.contributorController.newContributors.push(<Contributor>{
        email: user.email,
        user: user._id,
        role: this.contributorController.newRole,
        profileImage: user.profileImage,
        status: 'pending',
        invitedDate: new Date(),
        firstName: user.firstName,
        lastName: user.lastName
      });
    }
  }
  removeContributor(user) {
    _.remove(this.contributorController.newContributors, (x) => x._id == user._id);
  }
  inviteContributor() {
    if (this.contributorController.newContributors.length) {
      this.contributorController.newContributors = this.contributorController.newContributors.map(contributor => {
        return {
          ...contributor,
          role: this.contributorController.newRole
        }
      });
      this.isInviteLoading.start();
      forkJoin(this.contributorController.newContributors.map(contributor => {
        let obj = {
          contributor: contributor
        }
        return this.authStoreAdminService.inviteContributor(obj);
      })).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.isInviteLoading.stop()))
        .subscribe(result => {
          this.contributorController.existsContributors = _.union(this.contributorController.existsContributors, this.contributorController.newContributors);
          this.contributorController.newContributors = new Array;
          WsToastService.toastSubject.next({ content: "Contributors are invited!", type: 'success' });
        }, err => {
          WsToastService.toastSubject.next({ content: err.error, type: 'danger' });
        });
    }
    else {
      WsToastService.toastSubject.next({ content: "Please add a user to invite!", type: 'danger' });
    }
  }
  searchContributors(value) {
    if (value != '') {
      this.authStoreAdminService.searchContributors(value).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
        this.userSuggestions = result['result'];
      })
    }
    else {
      this.userSuggestions = [];
    }
  }
  openEditContributorModal(contributor) {
    this.isEditContributorModalOpened = true;
    this.contributorController.selectedContributor = contributor;
    this.contributorController.newRole = contributor.role;
  }
}
