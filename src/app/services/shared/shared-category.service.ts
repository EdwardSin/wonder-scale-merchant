import { Injectable } from '@angular/core';
import { Item } from '@objects/item';
import { AuthCategoryContributorService } from '@services/http/auth-shop/contributor/auth-category-contributor.service';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SharedItemService } from './shared-item.service';
import { SharedLoadingService } from './shared-loading.service';


@Injectable({
    providedIn: 'root'
})
export class SharedCategoryService {
    numberOfAllItems: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    numberOfDiscountItems: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    numberOfNewItems: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    numberOfTodaySpecialItems: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    numberOfPublishedItems: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    numberOfUnpublishedItems: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    numberOfUncategorizedItems: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    numberOfCurrentTotalItems: BehaviorSubject<number> = new BehaviorSubject<number>(0);
    allItemsRefresh: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    newItemsRefresh: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    todaySpecialItemsRefresh: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
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
        this.authCategoryContributorService.getNumberOfAllCategoriesItems()
        .pipe(tap(() =>{
            if(isRefreshCategory) {
                this.allItemsRefresh.next(true);
                this.newItemsRefresh.next(true);
                this.todaySpecialItemsRefresh.next(true);
                this.discountItemsRefresh.next(true);
                this.publishedItemsRefresh.next(true);
                this.unpublishedItemsRefresh.next(true);
                this.uncategorizedItemsRefresh.next(true);
                this.categoryRefresh.next({refresh: true, loading: false});
            }
        }))
            .subscribe(result => {
                this.sharedItemService.editItems.next([]);
                this.numberOfAllItems.next(result['number_of_all_items']);
                this.numberOfNewItems.next(result['number_of_new_items']);
                this.numberOfTodaySpecialItems.next(result['number_of_today_special_items']);
                this.numberOfDiscountItems.next(result['number_of_discount_items']);
                this.numberOfPublishedItems.next(result['number_of_published_items']);
                this.numberOfUnpublishedItems.next(result['number_of_unpublished_items']);
                this.numberOfUncategorizedItems.next(result['number_of_uncategorized_items']);
                this.categories.next(result['categories']);
                this.sharedLoadingService.screenLoading.next({loading: false});
                if (callback) {
                    callback();
                }
            });
    }

}
