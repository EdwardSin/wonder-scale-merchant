import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { QRCodeBuilder } from '@builders/qrcodebuilder';
import { SharedShopService } from '@services/shared/shared-shop.service';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { DocumentHelper } from '@helpers/documenthelper/document.helper';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as $ from 'jquery';
import { WsToastService } from '@elements/ws-toast/ws-toast.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.component.html',
  styleUrls: ['./qrcode.component.scss']
})
export class QrcodeComponent implements OnInit {
  shop;
  qrSize: number = 200;
  loading: WsLoading = new WsLoading;
  isQrcodeLoading: WsLoading = new WsLoading;
  displayImage = '';
  environment = environment;
  @ViewChild('urlInput', { static: true }) urlInput: ElementRef;
  @ViewChild('printContent', { static: true }) printContent: ElementRef;
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(private sharedShopService: SharedShopService, ) {
    this.loading.start();
    let shop_name = this.sharedShopService.shop_name;
    DocumentHelper.setWindowTitleWithWonderScale('QR Code - ' + shop_name);
    this.sharedShopService.shop.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        if (result) {
          this.shop = result;
          this.displayImage = 'assets/images/png/dot.png';
          if (this.shop.profileImage) {
            this.displayImage = environment.IMAGE_URL + this.shop.profileImage;
          }
        }
        this.loading.stop();
      })
  }
  ngOnInit() {
    this.renderQrcode();
  }
  ngAfterViewInit() {
  }
  copyToPrint() {
    let canvas = <HTMLCanvasElement>document.getElementById('canvas1');
    (<HTMLImageElement>document.getElementById('copyimage')).src = canvas.toDataURL('image/png');
  }
  renderQrcode() {
    this.isQrcodeLoading.start();
    this.qrSize = Math.max(72, this.qrSize);
    this.qrSize = Math.min(300, this.qrSize);
    $('.qrcode').html('');
    $(() => {
      QRCodeBuilder.toDataURL(this.displayImage, (dataUrl) => {
        let newImage = <HTMLImageElement>document.createElement('img');
        newImage.alt = 'profile-image';
        newImage.src = dataUrl;
        newImage.addEventListener('load', e => {
          QRCodeBuilder.createQRcode('.qrcode', this.shop.username, { width: this.qrSize, height: this.qrSize})
          .then(() => {
            this.renderProfileImageToQrcode(newImage);
            this.isQrcodeLoading.stop();
          });
        });
      });
    });
  }
  imageChangeEvent(event) {
    this.displayImage = event[0].url.changingThisBreaksApplicationSecurity;
    this.renderQrcode();
  }
  renderProfileImageToQrcode(image) {
    let canvas = document.getElementById('canvas1');
    let context =(<HTMLCanvasElement>canvas).getContext('2d');
    let width = this.qrSize / 3 * 190 / 300;
    let height = this.qrSize / 3 * 190 / 300;
    let offsetyY = this.qrSize * 9 / 300;
    let offsetX = this.qrSize/2 - width/2;
    let offsetY = this.qrSize/2 - height/2 - offsetyY;
    context.save();
    context.beginPath();
    context.arc(offsetX + width/2, offsetY + width/2, width/2, 0, 2*Math.PI);
    context.fill();
    context.clip();
    context.drawImage(image, offsetX, offsetY, width, height);
    context.restore();
  }
  copyURL() {
    $('#urlInput').select();
    document.execCommand("copy");
    WsToastService.toastSubject.next({ content: 'URL is copied!', type: 'success'});
  }  
  downloadQrcode() {
    let elementQrcode = document.getElementById('id-qrcode');
    let canvas = document.getElementById('canvas1');
    let dataURL = (<HTMLCanvasElement>canvas).toDataURL('image/png');
    (<HTMLLinkElement>elementQrcode).href = dataURL;
    (<HTMLLinkElement>elementQrcode).click();
  }
  printQrCode() {
    const WindowPrt = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
    WindowPrt.document.write(this.printContent.nativeElement.innerHTML);
    WindowPrt.document.close();
    WindowPrt.focus();
    WindowPrt.print();
    WindowPrt.close();
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
