import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { environment } from '@environments/environment';
import { AuthShopContributorService } from '@services/http/auth-shop/contributor/auth-shop-contributor.service';
import { SharedShopService } from '@services/shared/shared-shop.service';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { DocumentHelper } from '@helpers/documenthelper/document.helper';
import { WsToastService } from '@elements/ws-toast/ws-toast.service';
import { ImageHelper } from '@helpers/imagehelper/image.helper';
import _ from 'lodash';
import { from as observableFrom, Subject } from 'rxjs';
import { map, mergeMap, takeUntil } from 'rxjs/operators';
import { AuthShopUserService } from '@services/http/auth-user/auth-shop-user.service';
@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.scss']
})
export class InformationComponent implements OnInit {
  shop;
  numOfTotalImages: number = 0;
  allImages: Array<any> = [];
  editedFlag: boolean;
  isImagesUploading: boolean;
  isDeletedConfirmationModalOpened: boolean;
  selectedInformation;
  environment = environment;
  removeLoading: WsLoading = new WsLoading;
  loading: WsLoading = new WsLoading;
  @ViewChild('informationUploadInput', { static: true }) informationUploadInput: ElementRef;
  private ngUnsubscribe: Subject<any> = new Subject();
  constructor(private sharedShopService: SharedShopService,
    private authShopUserService: AuthShopUserService,
    private authShopContributorService: AuthShopContributorService) { }

  ngOnInit() {
    this.getShop();
  }
  getShop() {
    this.loading.start();
    let shop_username = this.sharedShopService.shop_username;
    this.authShopUserService.getAuthenticatedShopByShopUsername(shop_username).pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
      if (res) {
        DocumentHelper.setWindowTitleWithWonderScale('Information Banner - ' + res.name);
        this.shop = res;
        this.numOfTotalImages = this.shop.informationImages.length;
        this.allImages = this.shop.informationImages.map(image => { return { url: image, type: 'url' } });
        this.loading.stop();
      }
    });
  }
  uploadImagesAndEdit() {
    let images_blob = this.allImages.filter(image => image.type === 'blob');
    this.isImagesUploading = true;

    observableFrom(images_blob)
      .pipe(
        mergeMap(image => {
          return this.authShopContributorService
            .editInformationImages({
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
          this.shop.informationImages.splice(result['index'], 0, result['image']);
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
        informationImages: this.allImages.map(image => image.url)
      };
      this.authShopContributorService
        .editInformationImagesOrder(obj)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(result => {
          this.editedFlag = false;
          this.shop = result['result'];
          this.sharedShopService.shop.next(this.shop);
          WsToastService.toastSubject.next({ content: 'Banner is updated!', type: 'success' });
        });
    }
    else {
      this.uploadImagesAndEdit();
    }
  }
  removePreUploadImage(item) {
    _.remove(this.allImages, (x) => x.name == item.name);
    this.editedFlag = this.allImages.find(image => image.type == 'blob');
  }
  removeUploadedImage(image) {
    if (this.shop && this.shop['informationImages']) {
      this.removeLoading.start();
      var image_id = ImageHelper.getFormattedImage(
        image.url,
        environment.INFORMATION_IMG_PATH
      );
      this.authShopContributorService.removeInformationImage({ filename: image.url })
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(result => {
          _.remove(this.allImages, image);
          _.remove(this.shop['informationImages'], image.url);
          this.numOfTotalImages--;
          this.isDeletedConfirmationModalOpened = false;
          this.removeLoading.stop();
        });
    }
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
  drop(event: CdkDragDrop<string[]>) {
    this.editedFlag = true;
    moveItemInArray(this.allImages, event.previousIndex, event.currentIndex);
  }
  openInformationModal(selectedInformation) {
    this.isDeletedConfirmationModalOpened = true;
    this.selectedInformation = selectedInformation;
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
