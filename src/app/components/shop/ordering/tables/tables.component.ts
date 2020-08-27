import { Component, OnInit, ViewChildren, QueryList, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { AuthTableContributorService } from '@services/http/auth-shop/ordering-contributor/auth-table-contributor.service';
import Table from '@objects/table';
import { takeUntil, finalize } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { WsToastService } from '@elements/ws-toast/ws-toast.service';
import { SharedTableService } from '@services/shared/shared-table.service';
import { QRCodeBuilder } from '@builders/qrcodebuilder';
import { AuthShopUserService } from '@services/http/auth-user/auth-shop-user.service';
import { SharedShopService } from '@services/shared/shared-shop.service';
import { environment } from '@environments/environment';
import { saveAs } from 'file-saver';
import * as JSZip from 'jszip';
import * as JSZipUtils from 'jszip-utils';

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.scss']
})
export class TablesComponent implements OnInit {
  isModifyTableModalOpened: boolean;
  isQrcodeActionModalOpened: boolean;
  isImportTablesModalOpened: boolean;
  isRemoveConfirmationModalOpened: boolean;
  tableNo: string = '';
  maxPersons: number = 5;
  status: string = 'available';
  selectedTable: Table;
  qrcodeSize: number = 116;
  url: string = '';
  displayImage: string = '';
  maxPersonsArray: Array<number> = [];
  links: Array<any> = [];
  tables: Array<Table> = [];
  loading: WsLoading = new WsLoading;
  modifyLoading: WsLoading = new WsLoading;
  removeLoading: WsLoading = new WsLoading;
  @ViewChild('targetQrcode') targetQrcode: ElementRef;
  @ViewChildren('qrcode') qrcodes: QueryList<any>;
  private ngUnsubscribe: Subject<any> = new Subject;

  constructor(
    private ref: ChangeDetectorRef,
    private sharedTableService: SharedTableService,
    private sharedShopService: SharedShopService,
    private authShopUserService: AuthShopUserService,
    private authTableContributorService: AuthTableContributorService) { 
      this.maxPersonsArray = Array(30).fill(0).map((x, i) => i + 1);
    }

  ngOnInit(): void {
    let shop_username = this.sharedShopService.shop_username;
    this.sharedTableService.refreshTables.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result) {
        this.getTables();
      }
    });
    this.authShopUserService.getAuthenticatedShopByShopUsername(shop_username).pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result) {
        this.url = environment.URL + 'page/mobile/' + result.username + '?id=' + result._id + '&type=qr_scan&tableNo=';
        this.displayImage = result.profileImage ? 'api/images/' + encodeURIComponent(result.profileImage) : 'assets/images/svg/dot.svg';
      }
    });
    this.loading.start();
    this.getTables();
  }
  openDownloadModal() {
    this.isQrcodeActionModalOpened = true;
    this.ref.detectChanges();
    this.refreshQrcodes();
  }
  openModifyModal(table) {
    this.maxPersons = table.maxPersons;
    this.tableNo = table.tableNo;
    this.status = table.status;
    this.selectedTable = table;
    this.isModifyTableModalOpened = true;
  }
  openRemoveTableModal(table) {
    this.selectedTable = table;
    this.isRemoveConfirmationModalOpened = true;
  }
  closeModifyModal() {
    this.clearTableFields();
    this.isModifyTableModalOpened = false
  }
  closeImportTablesModal() {
    this.isImportTablesModalOpened = false;
  }
  closeDownloadModal() {
    this.isQrcodeActionModalOpened = false;
  }
  getTables() {
    this.authTableContributorService.getTables().pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.loading.stop())).subscribe(result => {
      this.tables = result['result'];
    });
  }
  addTable() {
    if (this.validateTable()) {
      let obj = {
        tableNo: this.tableNo,
        maxPersons: this.maxPersons,
        status: this.status
      }
      this.modifyLoading.start();
      this.authTableContributorService.addTable(obj).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.modifyLoading.stop())).subscribe(result => {
        this.getTables();
        this.clearTableFields();
        this.isModifyTableModalOpened = false;
        WsToastService.toastSubject.next({ content: 'Table is added successfully!', type: 'success'});
      }, err => {
        if (err.error.code == 11000) {
          WsToastService.toastSubject.next({ content: 'Table no already exists!', type: 'danger' });
        }
      });
    }
  }
  updateTable() {
    if (this.validateTable()) {
      let obj = {
        _id: this.selectedTable._id,
        tableNo: this.tableNo,
        maxPersons: this.maxPersons,
        status: this.status
      };
      this.modifyLoading.start();
      this.authTableContributorService.updateTable(obj).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.modifyLoading.stop())).subscribe(result => {
        this.getTables();
        this.clearTableFields();
        this.isModifyTableModalOpened = false;
        WsToastService.toastSubject.next({ content: 'Table is updated successfully!', type: 'success'});
      }, err => {
        if (err.error.code == 11000) {
          WsToastService.toastSubject.next({ content: 'Table no already exists!', type: 'danger' });
        }
      })
    }
  }
  validateTable() {
    if (!this.tableNo || this.tableNo.trim() == '') {
      WsToastService.toastSubject.next({ content: 'Please enter a valid table no!', type: 'danger' });
      return false;
    }
    if (this.maxPersons < 0 || this.maxPersons > 30) {
      WsToastService.toastSubject.next({ content: 'Please enter a valid max persons!', type: 'danger' });
      return false;
    }
    if (!this.status || this.status.trim() == '' ) {
      WsToastService.toastSubject.next({ content: 'Please enter a valid status!', type: 'danger' });
      return false;
    }
    return true;
  }
  removeTable() {
    this.removeLoading.start();
    this.authTableContributorService.removeTable(this.selectedTable._id).pipe(takeUntil(this.ngUnsubscribe), finalize(() => this.removeLoading.stop())).subscribe(result => {
      this.getTables();
      this.isRemoveConfirmationModalOpened = false;
      this.selectedTable = null;
    })
  }
  clearTableFields() {
    this.tableNo = '';
    this.maxPersons = 5;
    this.status = 'available';
    this.selectedTable = null;
  }
  refreshQrcodes(value=116) {
    if (this.tables.length) {
      this.qrcodeSize = value;
      this.renderQrcode(this.targetQrcode.nativeElement, this.url + this.tables[0]._id, this.qrcodeSize);
      this.qrcodes.forEach(qrcode => {
        this.renderQrcode(qrcode.nativeElement, qrcode.nativeElement.dataset.url, this.qrcodeSize);
      });
    }
  }
  generateZIP() {
    this.links = [];
    this.qrcodes.forEach(qrcode => {
      let canvas = $(qrcode.nativeElement).find('canvas');
      if (canvas.length) {
        let dataURL = (<HTMLCanvasElement>canvas[0]).toDataURL('image/jpeg', 1.0).split(',')[1];
        this.links.push(dataURL);
      }
    });
    var zip = new JSZip();
    var count = 0;
    var zipFilename = "WS-table-qrcodes.zip";
  
    this.links.forEach((url, i) => {
      // var filename = this.links[i];
      // filename = filename.replace(/[\/\*\|\:\<\>\?\"\\]/gi, '');
      // // loading a file and add it in a zip file
      // JSZipUtils.getBinaryContent(url, (err, data) => {
      //   if (err) {
      //     throw err; // or handle the error
      //   }
      zip.file('table-' + i + '.jpeg', url, { base64: true });
      count++;
      if (count == this.links.length) {
        zip.generateAsync({ type: 'blob' }).then((content) => {
          saveAs(content, zipFilename);
        });
      }
      // });
    });
  }
  renderQrcode(target, url, size) {
    $(target).find('canvas').remove();
    $(target).find('ws-spinner').css({display: 'block'});
    size = Math.max(75, size);
    size = Math.min(300, size);
    this.qrcodeSize = size;
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
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
