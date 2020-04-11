import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { environment } from '@environments/environment';
import { AuthShopContributorService } from '@services/http/auth-shop/contributor/auth-shop-contributor.service';
import { SharedShopService } from '@services/shared/shared-shop.service';
import { WsLoading } from '@components/elements/ws-loading/ws-loading';
import { DocumentHelper } from '@helpers/documenthelper/document.helper';
import { WsModalService } from '@components/elements/ws-modal/ws-modal.service';
import { WsToastService } from '@components/elements/ws-toast/ws-toast.service';
import { UploadHelper } from '@helpers/uploadhelper/upload.helper';
import { ImageHelper } from '@helpers/imagehelper/image.helper';
import _ from 'lodash';
import { from as observableFrom, Subject } from 'rxjs';
import { map, mergeMap, takeUntil } from 'rxjs/operators';
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
  selectedInformation;
  environment = environment;
  removeLoading: WsLoading = new WsLoading;
  loading: WsLoading = new WsLoading;
  @ViewChild('informationUploadInput', { static: true }) informationUploadInput: ElementRef;
  private ngUnsubscribe: Subject<any> = new Subject();
  constructor(private sharedShopService: SharedShopService,
    private modalService: WsModalService,
    private authShopContributorService: AuthShopContributorService) { }

  ngOnInit() {
    this.getShop();
  }
  getShop() {
    this.loading.start();
    this.sharedShopService.shop.pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
      if (res) {
        DocumentHelper.setWindowTitleWithWonderScale('Informations | ' + res.name);
        this.shop = res;
        this.numOfTotalImages = this.shop['informationImages'].length;
        this.allImages = this.shop['informationImages'].map(image => { return { url: image, type: 'url' } });
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
          WsToastService.toastSubject.next({ content: "Banner has been changed!", type: 'success' });
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
          WsToastService.toastSubject.next({ content: 'Order is updated!', type: 'success' });
        });
    }
    else {
      this.uploadImagesAndEdit();
    }
  }
  removePreUploadImage(item, event) {
    _.remove(this.allImages, item);
    this.numOfTotalImages--;
    event.stopPropagation();
    this.editedFlag = this.allImages.filter(image => image.type === 'blob').length > 0;
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
          this.closeModal('deleteItemModal');
          this.removeLoading.stop();
        });
    }
  }
  fileChangeEvent(event) {
    var preInformationFiles = <Array<File>>event.target.files;
    var ableUploadImages = UploadHelper.getMaxAbleUploadProfileFiles(this.numOfTotalImages, preInformationFiles, 10);

    UploadHelper.notificationIfOver(ableUploadImages, preInformationFiles);
    UploadHelper.showImages([], ableUploadImages, images => { callBack.bind(this)(images); }, true);

    function callBack(image) {
      this.allImages.unshift(image);
      this.numOfTotalImages++;
      this.editedFlag = this.allImages.filter(image => image.type === 'blob').length;
      this.informationUploadInput.nativeElement.value = '';
    }
  }
  drop(event: CdkDragDrop<string[]>) {
    this.editedFlag = true;
    moveItemInArray(this.allImages, event.previousIndex, event.currentIndex);
  }
  openModal(id, selectedInformation) {
    this.selectedInformation = selectedInformation;
    this.modalService.open(id);
  }
  closeModal(id) {
    this.modalService.close(id);
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
