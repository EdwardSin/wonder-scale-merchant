import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { environment } from '@environments/environment';
import { AuthStoreContributorService } from '@services/http/auth-store/contributor/auth-store-contributor.service';
import { SharedStoreService } from '@services/shared/shared-store.service';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { DocumentHelper } from '@helpers/documenthelper/document.helper';
import { WsToastService } from '@elements/ws-toast/ws-toast.service';
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
  store;
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
  constructor(private sharedStoreService: SharedStoreService,
    private authStoreContributorService: AuthStoreContributorService) { }

  ngOnInit() {
    this.getStore();
  }
  getStore() {
    this.loading.start();
    let storeUsername = this.sharedStoreService.storeUsername;
    this.authStoreContributorService.getStoreByUsername(storeUsername).pipe(takeUntil(this.ngUnsubscribe)).subscribe(res => {
      if (res) {
        DocumentHelper.setWindowTitleWithWonderScale('Information Banner - ' + res.name);
        this.store = res;
        this.numOfTotalImages = this.store.informationImages.length;
        this.allImages = this.store.informationImages.map(image => { return { url: image, type: 'url' } });
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
          return this.authStoreContributorService
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
          this.store.informationImages.splice(result['index'], 0, result['image']);
          this.allImages[result['index']] = { url: result['image'], type: 'url' };
        },
        err => { },
        () => {
          this.isImagesUploading = false;
          this.editedFlag = this.allImages.filter(image => image.type === 'blob').length > 0;
          this.editStore();
        }
      );
  }
  editStore() {
    if (this.allImages.filter(image => image.type === 'blob').length == 0) {
      var obj = {
        informationImages: this.allImages.map(image => image.url)
      };
      this.authStoreContributorService
        .editInformationImagesOrder(obj)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(result => {
          this.editedFlag = false;
          this.store = result['result'];
          this.sharedStoreService.store.next(this.store);
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
    if (this.store && this.store['informationImages']) {
      this.removeLoading.start();
      var image_id = ImageHelper.getFormattedImage(
        image.url,
        environment.INFORMATION_IMG_PATH
      );
      this.authStoreContributorService.removeInformationImage({ filename: image.url })
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(result => {
          _.remove(this.allImages, image);
          _.remove(this.store['informationImages'], image.url);
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
