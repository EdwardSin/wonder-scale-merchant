import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { QRCodeBuilder } from '@builders/qrcodebuilder';
import { SharedShopService } from '@services/shared/shared-shop.service';
import { WsLoading } from '@components/elements/ws-loading/ws-loading';
import { DocumentHelper } from '@helpers/documenthelper/document.helper';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as $ from 'jquery';

@Component({
  selector: 'app-qrcode',
  templateUrl: './qrcode.component.html',
  styleUrls: ['./qrcode.component.scss']
})
export class QrcodeComponent implements OnInit {
  shop;
  loading: WsLoading = new WsLoading;
  @ViewChild('printContent', { static: true }) printContent: ElementRef;
  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(private sharedShopService: SharedShopService, ) {
    this.loading.start();
    let shop_name = this.sharedShopService.shop_name;
    DocumentHelper.setWindowTitleWithWonderScale('QR Code | ' + shop_name);
    this.sharedShopService.shop.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        if (result) {
          this.shop = result;
          $('.qrcode').ready(() => {
            QRCodeBuilder.createQRcode('.qrcode', this.shop.username, this.shop._id);
            this.copyToPrint();
          })
        }
        this.loading.stop();
      })
  }
  ngOnInit() {
  }
  ngAfterViewInit() {
  }
  copyToPrint() {
    let canvas = <HTMLCanvasElement>document.getElementById('canvas1');
    (<HTMLImageElement>document.getElementById('copyimage')).src = canvas.toDataURL('image/png');
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
