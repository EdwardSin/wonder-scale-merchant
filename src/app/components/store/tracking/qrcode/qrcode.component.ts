import { Component, ElementRef, OnInit, ViewChild, ViewChildren, QueryList, ChangeDetectorRef } from '@angular/core';
import { QRCodeBuilder } from '@builders/qrcodebuilder';
import { SharedStoreService } from '@services/shared/shared-store.service';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { DocumentHelper } from '@helpers/documenthelper/document.helper';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as $ from 'jquery';
import { WsToastService } from '@elements/ws-toast/ws-toast.service';
import { environment } from '@environments/environment';
import { AuthTrackContributorService } from '@services/http/auth-store/contributor/auth-track-contributor.service';
import { AuthStoreUserService } from '@services/http/auth-user/auth-store-user.service';

@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.component.html',
  styleUrls: ['./qrcode.component.scss']
})
export class QrcodeComponent implements OnInit {
  store;
  qrSize: number = 200;
  loading: WsLoading = new WsLoading;
  isCreateQRcodeLoading: WsLoading = new WsLoading;
  isEditQRcodeLoading: WsLoading = new WsLoading;
  isRemovedQRcodeLoading: WsLoading = new WsLoading;
  isQRcodeLoading: WsLoading = new WsLoading;
  isActivateQRcodeLoading: WsLoading = new WsLoading;
  isInactivateQRcodeLoading: WsLoading = new WsLoading;
  displayImage = '';
  url = '';
  tracks = [];
  selectedTrack;
  newTrackName: string = '';
  editTrackName: string = '';
  isNewQRcodeOpened: boolean;
  isEditQRcodeOpened: boolean;
  isRemovedQRcodeOpened: boolean;
  isActivateQRcodeOpened: boolean;
  isInactivateQRcodeOpened: boolean;
  isQRcodeOpened: boolean;
  isInactiveExisted: boolean;
  isClear: boolean = sessionStorage.getItem('qrcodeTipsClear') == 'true';
  purpose: string = '';
  downloadURL: string = '';
  environment = environment;
  @ViewChild('urlInput', { static: true }) urlInput: ElementRef;
  @ViewChild('downloadQRcode', {static: false}) downloadQRcode: ElementRef;
  @ViewChildren('qrcode') qrcodes: QueryList<any>;
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(
    private ref: ChangeDetectorRef,
    private authStoreUserService: AuthStoreUserService,
    private sharedStoreService: SharedStoreService,
    private authTrackContributor: AuthTrackContributorService) {
    this.loading.start();
    let store_name = this.sharedStoreService.store_name;
    let storeUsername = this.sharedStoreService.storeUsername;
    DocumentHelper.setWindowTitleWithWonderScale('QR Code - ' + store_name);
    this.authStoreUserService.getAuthenticatedStoreByStoreUsername(storeUsername).pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        if (result) {
          this.store = result;
          this.displayImage = this.store.profileImage ? 'api/images/' + this.store.profileImage.replace(/\//g, ',') : 'assets/images/svg/dot.svg';
          this.url = environment.URL + 'page/' + this.store.username + '?type=qr_scan';
          this.getTracks();
        }
        this.loading.stop();
      })
  }
  ngOnInit() {
  }
  renderQrcode(target, url, size) {
    $(target).find('canvas').remove();
    $(target).find('ws-spinner').css({display: 'block'});
    size = Math.max(75, size);
    size = Math.min(300, size);
    this.qrSize = size;
    setTimeout(() => {
      let newImage = <HTMLImageElement>document.createElement('img');
      newImage.alt = 'profile-image';
      newImage.src = this.displayImage;
      newImage.addEventListener('load', e => {
        QRCodeBuilder.createQRcode(target, url, {width: size, height: size, callback: () => {
          $(target).find('ws-spinner').css({display: 'none'});
        }})
        .then(() => {
          QRCodeBuilder.renderProfileImageToQrcode(target, newImage, size);
        });
      });
    });
  }
  imageChangeEvent(event) {
    this.displayImage = event[0].url.changingThisBreaksApplicationSecurity;
  }
  copyURL(url) {
    var tempInput = document.createElement("input");
    tempInput.style.cssText = "position: absolute; left: -1000px; top: -1000px";
    tempInput.value = url;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
    WsToastService.toastSubject.next({ content: 'URL is copied!', type: 'success'});
  }  
  download() {
    let elementQrcode = document.getElementById('id-qrcode');
    let canvas = $(this.downloadQRcode.nativeElement).find('canvas');
    if (canvas.length) {
      let dataURL = (<HTMLCanvasElement>canvas[0]).toDataURL('image/jpeg', 1.0);
      (<HTMLLinkElement>elementQrcode).href = dataURL;
      (<HTMLLinkElement>elementQrcode).click();
    }
  }
  onPurposeChange(event) {
    let reg = new RegExp('[a-zA-Z0-9 -]');
    if (reg.test(event.key) || event.inputType == "deleteContentBackward") {
      return true;
    }
    return false;
  }
  onValueChange(value){
    value = value.replace(/[ -]/g, '_');
    value = value.toLowerCase();
    value = value.trim();
    return value;
  }
  openQRcodeModal(url) {
    this.isQRcodeOpened = true;
    this.isQRcodeLoading.start();
    this.ref.detectChanges();
    this.downloadURL = url;
    this.renderQrcode(this.downloadQRcode.nativeElement, url, 200);
  }
  openEditQRcodeModal(track) {
    this.isEditQRcodeOpened = true;
    this.selectedTrack = track;
    this.editTrackName = track.name;
  }
  openRemoveQRcodeModal(track) {
    this.isRemovedQRcodeOpened = true;
    this.selectedTrack = track;
  }
  openActivateModal(track) {
    this.isActivateQRcodeOpened = true;
    this.selectedTrack = track;
  }
  openInactivateModal(track) {
    this.isInactivateQRcodeOpened = true;
    this.selectedTrack = track;
  }
  getTracks() {
    this.authTrackContributor.getTracks().pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(result => {
      this.tracks = result['result'];
      this.ref.detectChanges();
      this.isInactiveExisted = this.tracks.find(x => x.status == 'inactive');
      this.qrcodes.forEach(qrcode => {
        this.renderQrcode(qrcode.nativeElement, qrcode.nativeElement.dataset.url, 116);
      });
    });
  }
  createNewQRcode() {
    this.isCreateQRcodeLoading.start();
    this.authTrackContributor.addNewTrack({ name: this.newTrackName }).pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(result => {
      this.newTrackName = '';
      this.isInactiveExisted = true;
      this.isNewQRcodeOpened = false;
      this.isCreateQRcodeLoading.stop();
      this.tracks.push(result['result']);
      this.ref.detectChanges();
      this.qrcodes.forEach(qrcode => {
        this.renderQrcode(qrcode.nativeElement, qrcode.nativeElement.dataset.url, 116);
      });
    }, err => {
      this.isCreateQRcodeLoading.stop();
      WsToastService.toastSubject.next({content: err.error, type: 'danger'});
    });
  }
  editQRcode() {
    this.isEditQRcodeLoading.start();
    this.authTrackContributor.editTrack({ name: this.editTrackName, _id: this.selectedTrack._id }).pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(result => {
      this.selectedTrack.name = this.editTrackName;
      this.editTrackName = '';
      this.isEditQRcodeOpened = false;
      this.isEditQRcodeLoading.stop();
    }, err => {
      this.isEditQRcodeLoading.stop();
      WsToastService.toastSubject.next({content: err.error, type: 'danger'});
    })
  }
  activateQRcode() {
    this.isActivateQRcodeLoading.start();
    this.authTrackContributor.activateTrack({id: this.selectedTrack._id}).pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(result => {
      this.isActivateQRcodeOpened = false;
      this.isActivateQRcodeLoading.stop();
      this.getTracks();
    }, err => {
      this.isActivateQRcodeLoading.stop();
      WsToastService.toastSubject.next({ content: err.error, type: 'danger'});
    })
  }
  inactivateQRcode() {
    this.isInactivateQRcodeLoading.start();
    this.authTrackContributor.inactivateTrack({id: this.selectedTrack._id}).pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(result => {
      this.isInactivateQRcodeOpened = false;
      this.isInactivateQRcodeLoading.stop();
      this.getTracks();
    }, err => {
      this.isInactivateQRcodeLoading.stop();
      WsToastService.toastSubject.next({ content: err.error, type: 'danger'});
    })
  }
  removeQRcode() {
    this.isRemovedQRcodeLoading.start();
    this.authTrackContributor.removeTrack(this.selectedTrack).pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(result => {
      this.getTracks();
      this.isRemovedQRcodeOpened = false;
      this.isRemovedQRcodeLoading.stop();
    }, err => {
      this.isRemovedQRcodeLoading.stop();
      WsToastService.toastSubject.next({content: err.error, type: 'danger'});
    })
  }
  closeAlert(){
    this.isClear = true;
    sessionStorage.setItem('qrcodeTipsClear', 'true');
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
