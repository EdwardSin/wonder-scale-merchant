import { Injectable } from '@angular/core';
import { Item } from '@objects/item';
import { AuthCategoryContributorService } from '@services/http/auth-shop/contributor/auth-category-contributor.service';
import { AuthItemContributorService } from '@services/http/auth-shop/contributor/auth-item-contributor.service';
import { BehaviorSubject, forkJoin, Subject } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { SharedItemService } from './shared-item.service';
import { SharedLoadingService } from './shared-loading.service';


@Injectable({
    providedIn: 'root'
})
export class SharedCategoryService {
    numberOfAllItems: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    numberOfDiscountItems: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    numberOfNewItems: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    numberOfPublishedItems: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    numberOfUnpublishedItems: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    numberOfUncategorizedItems: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    numberOfCurrentTotalItems: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    allItemsRefresh: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    newItemsRefresh: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    discountItemsRefresh: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    publishedItemsRefresh: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    unpublishedItemsRefresh: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    uncategorizedItemsRefresh: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    categoryRefresh: BehaviorSubject<{refresh: boolean, loading: boolean}> = new BehaviorSubject<{refresh: boolean, loading: boolean}>({refresh: false, loading:false});

    categories: BehaviorSubject<Item[]> = new BehaviorSubject<Item[]>([]);

    constructor(
        private sharedItemService: SharedItemService,
        private sharedLoadingService: SharedLoadingService,
        private authCategoryContributorService: AuthCategoryContributorService) { }


    refreshCategories(callback?, isLoading=false, isRefreshCategory=true) {
        if(isLoading) {
            this.sharedLoadingService.screenLoading.next({loading: true});
        }
        forkJoin([
            this.authCategoryContributorService.getNumberOfAllItems(),
            this.authCategoryContributorService.getNumberOfNewItems(),
            this.authCategoryContributorService.getNumberOfDiscountItems(),
            this.authCategoryContributorService.getNumberOfPublishedItems(),
            this.authCategoryContributorService.getNumberOfUnpublishedItems(),
            this.authCategoryContributorService.getNumberOfUncategorizedItems(),
            this.authCategoryContributorService.getAuthenticatedCategoriesByShopId().pipe(filter(x => x != null))
        ]).pipe(tap(() =>{
            if(isRefreshCategory) {
                this.allItemsRefresh.next(true);
                this.newItemsRefresh.next(true);
                this.discountItemsRefresh.next(true);
                this.publishedItemsRefresh.next(true);
                this.unpublishedItemsRefresh.next(true);
                this.uncategorizedItemsRefresh.next(true);
                this.categoryRefresh.next({refresh: true, loading: false});
            }
        }))
            .subscribe(results => {
                this.sharedItemService.editItems.next([]);
                this.numberOfAllItems.next(results[0]['result']);
                this.numberOfNewItems.next(results[1]['result']);
                this.numberOfDiscountItems.next(results[2]['result']);
                this.numberOfPublishedItems.next(results[3]['result']);
                this.numberOfUnpublishedItems.next(results[4]['result']);
                this.numberOfUncategorizedItems.next(results[5]['result']);
                this.categories.next(results[6]['result']);
                this.sharedLoadingService.screenLoading.next({loading: false});
                if (callback) {
                    callback();
                }
            });
    }

}
