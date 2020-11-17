import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SharedStoreService } from '@services/shared/shared-store.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as $ from 'jquery';
import { QRCodeBuilder } from '@builders/qrcodebuilder';
import { environment } from '@environments/environment';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { DocumentHelper } from '@helpers/documenthelper/document.helper';

@Component({
  selector: 'app-home-control',
  templateUrl: './home-control.component.html',
  styleUrls: ['./home-control.component.scss']
})
export class HomeControlComponent implements OnInit {
  storeUsername: string = '';
  store;
  qrSize: number = 200;
  displayImage = '';
  url = '';
  downloadURL = '';
  isQRcodeOpened: boolean;
  isQRcodeLoading: WsLoading = new WsLoading;
  @ViewChild('downloadQRcode', {static: false}) downloadQRcode: ElementRef;
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(private sharedStoreService: SharedStoreService,
    private ref: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.storeUsername = this.sharedStoreService.storeUsername;
    this.sharedStoreService.store.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.store = result;
      DocumentHelper.setWindowTitleWithWonderScale('Home - ' + this.store.name);
      this.displayImage = this.store.profileImage ? 'api/images/' + this.store.profileImage.replace(/\//g, ',') : 'assets/images/svg/dot.svg';
      this.url = environment.URL + 'page/' + this.store.username + '?type=qr_scan';
    })
  }
  isStoreDetailsCompleted() {
    return this.store.profileImage && this.store.description &&
            this.isContactDetailsCompleted() &&
            this.isLocationDetailsCompleted() &&
            this.store.openingInfoType;
  }
  isContactDetailsCompleted() {
    return this.store.email && this.store.email.length ||
          this.store.website && this.store.website.length ||
          this.store.phone && this.store.phone.length ||
          this.store.media && this.store.media.length;
  }
  isLocationDetailsCompleted() {
    return this.store.showAddress && this.store.location &&
          this.store.location.coordinates[0] !== 0 &&
          this.store.location.coordinates[0] !== 0 &&
          this.store.fullAddress &&
          this.store.fullAddress.address &&
          this.store.fullAddress.state &&
          this.store.fullAddress.postcode &&
          this.store.fullAddress.country;
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
  download() {
    let elementQrcode = document.getElementById('id-qrcode');
    let canvas = $(this.downloadQRcode.nativeElement).find('canvas');
    if (canvas.length) {
      let dataURL = (<HTMLCanvasElement>canvas[0]).toDataURL('image/jpeg', 1.0);
      (<HTMLLinkElement>elementQrcode).href = dataURL;
      (<HTMLLinkElement>elementQrcode).click();
    }
  }
  openQRcodeModal(url) {
    this.isQRcodeOpened = true;
    this.isQRcodeLoading.start();
    this.ref.detectChanges();
    this.downloadURL = url;
    this.renderQrcode(this.downloadQRcode.nativeElement, url, 200);
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
