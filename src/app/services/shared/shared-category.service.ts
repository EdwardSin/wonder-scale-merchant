import { Injectable } from '@angular/core';
import { Item } from '@objects/item';
import { AuthCategoryContributorService } from '@services/http/auth-shop/contributor/auth-category-contributor.service';
import { AuthItemContributorService } from '@services/http/auth-shop/contributor/auth-item-contributor.service';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { filter } from 'rxjs/operators';
import { SharedItemService } from './shared-item.service';
import { SharedLoadingService } from './shared-loading.service';


@Injectable({
    providedIn: 'root'
})
export class SharedCategoryService {
    numberOfAllItems: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    numberOfDiscountItems: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    numberOfNewItems: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    numberOfPublishItems: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    numberOfUnpublishItems: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    numberOfUncategoriedItems: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    allItemsRefresh: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    newItemsRefresh: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    discountItemsRefresh: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    publishItemsRefresh: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    unpublishItemsRefresh: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    uncategoriedItemsRefresh: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    categoryRefresh: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    categoriesRefresh: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    categories: BehaviorSubject<Item[]> = new BehaviorSubject<Item[]>([]);

    constructor(
        private sharedItemService: SharedItemService,
        private sharedLoadingService: SharedLoadingService,
        private authCategoryContributorService: AuthCategoryContributorService) { }


    refreshCategories(callback?) {
        this.sharedLoadingService.screenLoading.next(true);
        forkJoin([
            this.authCategoryContributorService.getNumberOfAllItems(),
            this.authCategoryContributorService.getNumberOfNewItems(),
            this.authCategoryContributorService.getNumberOfDiscountItems(),
            this.authCategoryContributorService.getNumberOfPublishItems(),
            this.authCategoryContributorService.getNumberOfUnpublishItems(),
            this.authCategoryContributorService.getNumberOfUncategoriedItems(),
            this.authCategoryContributorService.getAuthenticatedCategoriesByShopId().pipe(filter(x => x != null))
        ])
            .subscribe(results => {
                this.sharedItemService.editItems.next([]);
                this.numberOfAllItems.next(results[0]['result']);
                this.numberOfNewItems.next(results[1]['result']);
                this.numberOfDiscountItems.next(results[2]['result']);
                this.numberOfPublishItems.next(results[3]['result']);
                this.numberOfUnpublishItems.next(results[4]['result']);
                this.numberOfUncategoriedItems.next(results[5]['result']);
                this.categories.next(results[6]['result']);
                this.sharedLoadingService.screenLoading.next(false);
                this.allItemsRefresh.next(true);
                this.newItemsRefresh.next(true);
                this.discountItemsRefresh.next(true);
                this.publishItemsRefresh.next(true);
                this.unpublishItemsRefresh.next(true);
                this.uncategoriedItemsRefresh.next(true);
                this.categoryRefresh.next(true);

                if (callback) {
                    callback();
                }
            });
    }

}
