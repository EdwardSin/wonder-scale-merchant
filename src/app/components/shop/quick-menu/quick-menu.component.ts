import { Component, OnInit } from '@angular/core';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Subject, forkJoin, from } from 'rxjs';
import { SharedShopService } from '@services/shared/shared-shop.service';
import { takeUntil, mergeMap, map } from 'rxjs/operators';
import { Shop } from '@objects/shop';
import { environment } from '@environments/environment';
import * as _ from 'lodash';
import { AuthShopContributorService } from '@services/http/auth-shop/contributor/auth-shop-contributor.service';
import { WsToastService } from '@elements/ws-toast/ws-toast.service';
import { ImageHelper } from '@helpers/imagehelper/image.helper';
import { DocumentHelper } from '@helpers/documenthelper/document.helper';

@Component({
  selector: 'app-quick-menu',
  templateUrl: './quick-menu.component.html',
  styleUrls: ['./quick-menu.component.scss']
})
export class QuickMenuComponent implements OnInit {
  environment = environment;
  loading: WsLoading = new WsLoading;
  allImages = [];
  selectedMenu;
  isImagesUploading: boolean = false;
  removeLoading: WsLoading = new WsLoading;
  numOfTotalImages: number = 0;
  isDeletedConfirmationModalOpened: boolean = false;
  editedFlag: boolean = false;
  shop: Shop;
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(private authShopContributorService: AuthShopContributorService, private sharedShopService: SharedShopService) { 
    this.sharedShopService.shop.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result) {
        DocumentHelper.setWindowTitleWithWonderScale('Quick Menu - ' + result.name);
        this.shop = result;
        this.numOfTotalImages = this.shop.menuImages.length;
        this.allImages = this.shop.menuImages.map(image => { return { url: image, type: 'url' } });
        this.loading.stop();
      }
    });
  }
  ngOnInit(): void {
  }
  uploadImagesAndEdit() {
    let images_blob = this.allImages.filter(image => image.type === 'blob');
    this.isImagesUploading = true;

    from(images_blob)
      .pipe(
        mergeMap(image => {
          return this.authShopContributorService
            .editMenuImages({
              file: image.base64,
              fileext: image['ext'],
              index: this.allImages.indexOf(image)
            })
            .pipe(
              map(x => {
                x['index'] = this.allImages.indexOf(image);
                return x;
              })
            )
        }),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(
        result => {
          this.shop.menuImages.splice(result['index'], 0, result['image']);
          this.allImages[result['index']] = { url: result['image'], type: 'url' };
        },
        err => { },
        () => {
          this.isImagesUploading = false;
          this.editedFlag = this.allImages.filter(image => image.type === 'blob').length > 0;
          this.editShop();
        }
      );
  }
  editShop() {
    if (this.allImages.filter(image => image.type === 'blob').length == 0) {
      var obj = {
        menuImages: this.allImages.map(image => image.url)
      };
      this.authShopContributorService
        .editMenuImagesOrder(obj)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(result => {
          this.editedFlag = false;
          this.shop = result['result'];
          this.sharedShopService.shop.next(this.shop);
          WsToastService.toastSubject.next({ content: 'Menu is updated!', type: 'success' });
        });
    }
    else {
      this.uploadImagesAndEdit();
    }
  }
  
  removeUploadedImage(image) {
    if (this.shop && this.shop['menuImages']) {
      this.removeLoading.start();
      var image_id = ImageHelper.getFormattedImage(
        image.url,
        environment.MENU_IMG_PATH
      );
      this.authShopContributorService.removeMenuImage({ filename: image.url })
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(result => {
          _.remove(this.allImages, image);
          _.remove(this.shop['menuImages'], image.url);
          this.numOfTotalImages--;
          this.isDeletedConfirmationModalOpened = false;
          this.removeLoading.stop();
        });
    }
  }
  removePreUploadImage(item) {
    _.remove(this.allImages, (x) => x.name == item.name);
    this.editedFlag = this.allImages.find(image => image.type == 'blob');
  }
  drop(event: CdkDragDrop<string[]>) {
    this.editedFlag = true;
    moveItemInArray(this.allImages, event.previousIndex, event.currentIndex);
  }
  fileChangeEvent(event) {
    event.forEach(item => {
      let exist = this.allImages.find(image => {
        return image.name == item.name && image.file.size == item.file.size;
      })
      if (!exist) {
        this.allImages.push(item);
        this.editedFlag = true;
      }
    });
  }
  openMenuModal(selectedMenu) {
    this.isDeletedConfirmationModalOpened = true;
    this.selectedMenu = selectedMenu;
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
