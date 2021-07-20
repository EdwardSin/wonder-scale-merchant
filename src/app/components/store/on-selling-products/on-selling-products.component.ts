import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { WsToastService } from '@elements/ws-toast/ws-toast.service';
import { DocumentHelper } from '@helpers/documenthelper/document.helper';
import { AuthOnSellingCategoryContributorService } from '@services/http/auth-store/contributor/auth-on-selling-category-contributor.service';
import { SharedCategoryService } from '@services/shared/shared-category.service';
import { SharedStoreService } from '@services/shared/shared-store.service';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import * as _ from 'lodash';
import { WsLoading } from '@elements/ws-loading/ws-loading';

@Component({
  selector: 'app-on-selling-products',
  templateUrl: './on-selling-products.component.html',
  styleUrls: ['./on-selling-products.component.scss']
})
export class OnSellingProductsComponent implements OnInit {
  store;
  storeUsername: string;
  editingName: string;
  isPublished: boolean;
  selectedCategory;
  isEditCategoryOpened: boolean;
  isRemoveCategoryConfirmationModalOpened: boolean;
  loading: WsLoading = new WsLoading;
  editLoading: WsLoading = new WsLoading;
  removeLoading: WsLoading = new WsLoading;
  categories: Array<any> = [];
  numberOfNewItems: number = 0;
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(private sharedCategoryService: SharedCategoryService,
    private sharedStoreService: SharedStoreService,
    private authOnSellingCategoryContributorService: AuthOnSellingCategoryContributorService) { 
    }
  ngOnInit() {
    this.sharedCategoryService.refreshCategories(() => {}, false, false);
    this.sharedCategoryService.numberOfNewItems.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.numberOfNewItems = res;
      })
    this.sharedCategoryService.onSellingCategories.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        if (res) {
          this.categories = res;
          this.loading.stop();
        }
      })
    this.loading.start();
    this.sharedStoreService.store.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        if (result) {
          DocumentHelper.setWindowTitleWithWonderScale('On Selling Products - ' + result.name);
          this.store = result;
          this.sharedStoreService.store_id = this.store._id;
          this.sharedStoreService.store_name = this.store.name;
          this.sharedStoreService.storeUsername = this.store.username;
          this.numberOfNewItems = this.store.number_of_new_items;
          this.storeUsername = this.store.username;
          
          // this.getUnrepliedRequests();
          this.refreshCategories();
        }
      })
  }
  refreshCategories() {
    this.sharedCategoryService.refreshCategories(null, false, false);
  }
  onEditCategoryClicked(category) {
    this.selectedCategory = category;
    this.editingName = category.name;
    this.isPublished = category.isPublished;
    this.isEditCategoryOpened = true;
  }
  dropOrder(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.categories, event.previousIndex, event.currentIndex);
    this.authOnSellingCategoryContributorService
      .rearrangeCategories({ categories: this.categories.map(x => x._id) })
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
      });
  }
  addCategory() {
    if (this.isValidated(this.editingName)) {
      let obj = {
        name: this.editingName,
        isPublished: this.isPublished
      };
      this.editLoading.start();
      this.authOnSellingCategoryContributorService
        .addCategory(obj)
        .pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.editLoading.stop()))
        .subscribe(result => {
          WsToastService.toastSubject.next({ content: 'Category is added!', type: 'success' });
          result['result'].items = [];
          this.categories.push(result['result']);
          this.onEditCategoryClosed();
        }, (err) => {
          WsToastService.toastSubject.next({ content: err.error, type: 'danger' });
        });
    }
  }
  editCategory() {
    if (this.isValidated(this.editingName)) {
      let category_id = this.selectedCategory['_id'];
      var obj = {
        category_id,
        name: this.editingName || this.selectedCategory['name'],
        isPublished: this.isPublished
      };
      this.editLoading.start();
      this.authOnSellingCategoryContributorService
        .editCategory(obj)
        .pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.editLoading.stop()))
        .subscribe(result => {
          WsToastService.toastSubject.next({ content: 'Category is edited!', type: 'success' });
          this.selectedCategory['name'] = this.editingName;
          this.selectedCategory['isPublished'] = this.isPublished;
          this.onEditCategoryClosed();
        }, (err) => {
          WsToastService.toastSubject.next({ content: err.error, type: 'danger' });
        });
    }
  }
  removeCategory() {
    this.removeLoading.start();
    this.authOnSellingCategoryContributorService
      .removeCategories({categories: [this.selectedCategory['_id']]})
      .pipe(takeUntil(this.ngUnsubscribe), finalize(() => {this.removeLoading.stop()}))
      .subscribe(result => {
        WsToastService.toastSubject.next({ content: "Category is removed!", type: 'success' });
        _.remove(this.categories, (x) => this.selectedCategory['_id'] === x._id);
        this.isRemoveCategoryConfirmationModalOpened = false;
        this.sharedCategoryService.refreshCategories(null, false, true);
      }, (err) => {
        WsToastService.toastSubject.next({ content: err.error, type: 'danger' });
      });
  }
  onEditCategoryClosed() {
    this.isEditCategoryOpened = false;
    this.selectedCategory = null;
    this.editingName = '';
  }
  openRemoveModal(category) {
    this.selectedCategory = category;
    this.isRemoveCategoryConfirmationModalOpened = true;
  }
  isValidated(name) {
    if (name == '' || name.trim() == '') {
      WsToastService.toastSubject.next({ content: 'Category name is invalid!', type: 'danger' });
      return false;
    } else if (name.length > 32) {
      WsToastService.toastSubject.next({ content: 'Category name is too long!', type: 'danger' });
      return false;
    }
    return true;
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
