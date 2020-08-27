import { Component, OnInit } from '@angular/core';
import { AuthOrderingConfigurationContributorService } from '@services/http/auth-shop/ordering-contributor/auth-ordering-configuration-contributor.service';
import { SharedUserService } from '@services/shared/shared-user.service';
import { finalize, takeUntil } from 'rxjs/operators';
import OrderingConfiguration from '../../../../objects/ordering-configuration';
import { Subject } from 'rxjs';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { AuthShopAdminService } from '@services/http/auth-shop/admin/auth-shop-admin.service';
import { environment } from '@environments/environment';
import * as _ from 'lodash';
import { WsToastService } from '@elements/ws-toast/ws-toast.service';
import { AuthPackageAdminService } from '@services/http/auth-shop/admin/auth-package-admin.service';

@Component({
  selector: 'app-ordering-configurations',
  templateUrl: './ordering-configurations.component.html',
  styleUrls: ['./ordering-configurations.component.scss']
})
export class OrderingConfigurationsComponent implements OnInit {
  environment = environment;
  configuration: OrderingConfiguration;
  merchantCodeLoading: WsLoading = new WsLoading;
  loading: WsLoading = new WsLoading;
  userLoading: WsLoading = new WsLoading;
  removeUserLoading: WsLoading = new WsLoading;
  isEdit: boolean;
  isAnonymousUserModalOpened: boolean;
  isRenewMerchantCodeConfirmationModalOpened: boolean;
  username: string = '';
  password: string = '';
  selectedContributor: any;
  tempRole: string = '';
  role: string = 'waiter';
  searchText: string = '';
  user;
  
  tempContributor: any;
  userContributors: Array<any> = [];
  adminContributors: Array<any> = [];
  waiterContributors: Array<any> = [];
  chefContributors: Array<any> = [];
  userSuggestions: Array<any> = [];
  valueChanged = _.debounce((value) => this.searchContributors(value), 300);
  private ngUnsubscribe: Subject<any> = new Subject<any>();
  constructor(private authShopAdminService: AuthShopAdminService,
    private authPackageAdminService: AuthPackageAdminService,
    private sharedUserService: SharedUserService,
    private authOrderingConfigurationContributorService: AuthOrderingConfigurationContributorService) {
      this.loading.start();
      this.getOrderingContriburation();
      this.user = this.sharedUserService.user.getValue();
    // this.addOrederingPackage();
  }
  ngOnInit(): void {
  }
  addOrederingPackage() {
    this.authPackageAdminService.addShopPackage('ordering').pipe(takeUntil(this.ngUnsubscribe), finalize(() => {})).subscribe(result => {
    });
  }
  getOrderingContriburation() {
    this.authOrderingConfigurationContributorService.getOrderingConfiguration().pipe(takeUntil(this.ngUnsubscribe), finalize(() => { this.loading.stop() })).subscribe(result => {
      if (result['result']) {
        this.configuration = result['result'];
        this.filterPageRole();
      }
    });
  }
  renewMerchantCode() {
    this.merchantCodeLoading.start();
    this.authOrderingConfigurationContributorService.renewMerchantCode().pipe(takeUntil(this.ngUnsubscribe), finalize(() => { this.merchantCodeLoading.stop(); })).subscribe(result => {
      this.configuration.merchantCode = result['result'];
      this.isRenewMerchantCodeConfirmationModalOpened = false;
    });
  }
  addPageRole() {
    if (this.tempContributor && this.tempRole) {
      let obj = {
        user: this.tempContributor._id,
        role: this.tempRole
      };
      this.authOrderingConfigurationContributorService.addPageRole(obj).pipe(takeUntil(this.ngUnsubscribe), finalize(() => { this.userLoading.stop() })).subscribe(result => {
        if (result['result']) {
          this.configuration = result['result'];
          this.filterPageRole();
          this.clearFields();
        }
      }, err => {
        if (err.error.message) {
          WsToastService.toastSubject.next({ content: err.error.message, type: 'danger'});
        }
      });
    } else if (!this.tempContributor) {
      WsToastService.toastSubject.next({content: 'Please select a user!', type: 'danger'});
    } else if (!this.tempRole) {
      WsToastService.toastSubject.next({content: 'Please select a role!', type: 'danger'});
    }
  }
  addAnonymousPageRole() {
    if (!this.username || this.username.trim() == '') {
      WsToastService.toastSubject.next({ content: 'Please enter username!', type: 'danger'});
    } else if (!this.password || this.password.trim() == '') {
      WsToastService.toastSubject.next({ content: 'Please enter password!', type: 'danger'});
    } else if (!this.role || this.role.trim() == '') {
      WsToastService.toastSubject.next({ content: 'Please enter role!', type: 'danger'});
    } else {
      let obj = {
        username: this.username.trim(),
        password: this.password.trim(),
        role: this.role
      };
      this.userLoading.start();
      this.authOrderingConfigurationContributorService.addAnonymousPageRole(obj).pipe(takeUntil(this.ngUnsubscribe), finalize(() => { this.userLoading.stop() })).subscribe(result => {
        if (result['result']) {
          this.configuration = result['result'];
          this.filterPageRole();
          this.isAnonymousUserModalOpened = false;
          this.clearFields();
        }
      }, err => {
        if (err.error) {
          WsToastService.toastSubject.next({ content: err.error.message, type: 'danger' });
        }
      });
    }
  }
  updatePageRole() {
    if (!this.role || this.role.trim() == '') {
      WsToastService.toastSubject.next({ content: 'Please enter role!', type: 'danger'});
    } else {
      let obj = {
        _id: this.selectedContributor._id,
        role: this.role
      };
      if (this.selectedContributor.username) {
        if (!this.username || this.username.trim() == '') {
          WsToastService.toastSubject.next({ content: 'Please enter username!', type: 'danger'});
          return;
        }
        obj['username'] = this.username;
      }
      this.userLoading.start();
      this.authOrderingConfigurationContributorService.updatePageRole(obj).pipe(takeUntil(this.ngUnsubscribe), finalize(() => { this.userLoading.stop() })).subscribe(result => {
        if (result['result']) {
          this.configuration = result['result'];
          this.clearFields();
          this.filterPageRole();
          this.isAnonymousUserModalOpened = false;
        }
      }, err => {
        if (err.error.message) {
          WsToastService.toastSubject.next({ content: err.error.message, type: 'danger'});
        }
      });
    }
  }
  removePageRole() {
    let id = this.selectedContributor._id;
    this.removeUserLoading.start();
    this.authOrderingConfigurationContributorService.removePageRole(id).pipe(takeUntil(this.ngUnsubscribe), finalize(() => { this.removeUserLoading.stop() })).subscribe(result => {
      if (result['result']) {
        this.configuration = result['result'];
        this.clearFields();
        this.filterPageRole();
        this.isAnonymousUserModalOpened = false;
      }
    }, err => {
      if (err.error.message) {
        WsToastService.toastSubject.next({ content: err.error.message, type: 'danger'});
      }
    });
  }
  filterPageRole() {
    this.userContributors = this.configuration.contributors.filter(contributor => contributor.user);
    this.adminContributors = this.configuration.contributors.filter(contributor => contributor.role == 'admin');
    this.waiterContributors = this.configuration.contributors.filter(contributor => contributor.role == 'waiter');
    this.chefContributors = this.configuration.contributors.filter(contributor => contributor.role == 'chef');
  }
  clearFields() {
    this.tempContributor = null;
    this.tempRole = '';
    this.selectedContributor = null;
    this.username = '';
    this.password = '';
    this.role = 'waiter';
  }
  searchContributors(value) {
    if (value != '') {
      this.authShopAdminService.searchContributors(value).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
        this.userSuggestions = result['result'];
      })
    }
    else {
      this.userSuggestions = [];
    }
  }
  addTempPageRole(user) {
    this.userSuggestions = [];
    this.searchText = '';
    if (_.find(this.userContributors, x => x.email == user.email)) {
      WsToastService.toastSubject.next({ content: 'User is already a contributor!', type: 'danger'});
    }
    else if (_.find(this.userContributors, (x) => x.email == user.email)) {
      WsToastService.toastSubject.next({ content: "User has been added!", type: 'danger' });
    }
    else {
      this.tempContributor = user;
    }
  }
  removeTempPageRole() {
    this.tempContributor = null;
  }
  openAnonymousUserModal() {
    this.isAnonymousUserModalOpened = true;
    this.selectedContributor = null;
    this.username = '';
    this.password = '';
    this.role = 'waiter';
  }
  openEditAnonymousUser(contributor) {
    this.isAnonymousUserModalOpened = true;
    this.selectedContributor = contributor;
    this.username = this.selectedContributor.username;
    this.role = this.selectedContributor.role;
  }
  openEditUser(contributor) {
    this.isAnonymousUserModalOpened = true;
    this.selectedContributor = contributor;
    this.role = this.selectedContributor.role;
  }
  closeAnonymousUserModal() {
    this.isAnonymousUserModalOpened = false;
  }
}
