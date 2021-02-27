import { Component, OnInit } from '@angular/core';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Subject, from, of } from 'rxjs';
import { SharedStoreService } from '@services/shared/shared-store.service';
import { takeUntil, mergeMap, map } from 'rxjs/operators';
import { Store } from '@objects/store';
import { environment } from '@environments/environment';
import * as _ from 'lodash';
import { AuthStoreContributorService } from '@services/http/auth-store/contributor/auth-store-contributor.service';
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
  store: Store;
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(private authStoreContributorService: AuthStoreContributorService, private sharedStoreService: SharedStoreService) { 
    let storeUsername = this.sharedStoreService.storeUsername;
    this.loading.start();
    this.authStoreContributorService.getStoreByUsername(storeUsername).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result) {
        DocumentHelper.setWindowTitleWithWonderScale('Quick Menu - ' + result.name);
        this.store = result;
        this.numOfTotalImages = this.store.menuImages.length;
        this.allImages = this.store.menuImages.map(image => { return { url: image, type: 'url' } });
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
          return this.authStoreContributorService
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
          this.store.menuImages.splice(result['index'], 0, result['image']);
          this.allImages[result['index']] = { url: result['image'], type: 'url' };
        },
        err => { 
          this.isImagesUploading = false;
         },
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
        menuImages: this.allImages.map(image => image.url)
      };
      this.authStoreContributorService
        .editMenuImagesOrder(obj)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(result => {
          this.editedFlag = false;
          this.store = result['result'];
          this.sharedStoreService.store.next(this.store);
          WsToastService.toastSubject.next({ content: 'Menu is updated!', type: 'success' });
        });
    }
  }
  
  removeUploadedImage(image) {
    if (this.store && this.store['menuImages']) {
      this.removeLoading.start();
      var image_id = ImageHelper.getFormattedImage(
        image.url,
        environment.MENU_IMG_PATH
      );
      this.authStoreContributorService.removeMenuImage({ filename: image.url })
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(result => {
          _.remove(this.allImages, image);
          _.remove(this.store['menuImages'], image.url);
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
      ImageHelper.resizeImage(item.base64, null, null , .5).then(() => {
        let exist = this.allImages.find(image => {
          return image.name == item.name && image.file.size == item.file.size;
        })
        if (!exist) {
          this.allImages.push(item);
          this.editedFlag = true;
        }
      });
    });
  }
  onImagesOverflow() {
    WsToastService.toastSubject.next({ content: 'Max 10 images are uploaded!', type: 'danger'});
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
