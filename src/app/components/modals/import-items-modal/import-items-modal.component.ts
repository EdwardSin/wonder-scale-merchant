import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthItemContributorService } from '@services/http/auth-shop/contributor/auth-item-contributor.service';
import { SharedLoadingService } from '@services/shared/shared-loading.service';
import { SharedShopService } from '@services/shared/shared-shop.service';
import { WsModalClass } from '@elements/ws-modal/ws-modal';
import { WsModalService } from '@elements/ws-modal/ws-modal.service';
import _ from 'lodash';
import { takeUntil } from 'rxjs/operators';
import * as XLSX from 'xlsx';
import { read, write } from 'xlsx';

@Component({
  selector: 'import-items-modal',
  templateUrl: './import-items-modal.component.html',
  styleUrls: ['./import-items-modal.component.scss']
})



export class ImportItemsModalComponent extends WsModalClass implements OnInit {
  isHeaderValid: boolean;
  isEmptyField: boolean;
  isStockValid: boolean;
  isNumberValid: boolean;
  upload_obj;
  shop;
  category_id;
  @ViewChild('tableView', { static: true }) tableView: ElementRef;
  constructor(modalService: WsModalService,
    private ref: ChangeDetectorRef,
    private authItemContributorService: AuthItemContributorService,
    private sharedShopService: SharedShopService,
    private sharedLoadingService: SharedLoadingService,
    el: ElementRef) {
    super(modalService, el);
  }

  ngOnInit() {
    super.ngOnInit();
    this.sharedShopService.shop.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        if (result) {
          this.shop = result;
        }
      })
  }
  closeCallback = () => {
    this.isEmptyField = false;
    this.isHeaderValid = false;
    this.isNumberValid = false;
    this.isStockValid = false;
  }
  setElement(event) {
    var files = event.target.files, file;
    if (!files || files.length == 0) return;
    file = files[0];
    var reader = new FileReader();

    this.category_id = event.category_id;
    reader.onload = (e) => {
      const csv: string | ArrayBuffer = <ArrayBuffer>reader.result;
      let data = new Uint8Array(csv);
      this.ref.detectChanges();
      let wb = read(data, { type: 'array', sheetStubs: true, cellDates: true, cellStyles: true });
      let htmlstr = write(wb, { sheet: wb.SheetNames[0], type: 'binary', bookType: 'html' });
      try {
        this.isValidated(wb);
      }
      catch (err) {
        console.log(err);
      }

      this.tableView.nativeElement.innerHTML = '';
      this.tableView.nativeElement.innerHTML += htmlstr;
    };
    reader.readAsArrayBuffer(file);
    super.setElement(event);
  }
  headerValidate(sheet) {
    return sheet['A1'].v == 'ID' && sheet['B1'].v == 'Name' && sheet['C1'].v == 'Price' &&
      sheet['D1'].v == 'Quantity' && sheet['E1'].v == 'In-Stock' && sheet['F1'].v == 'Description';
  }
  stockValidate(obj) {
    for (let item of obj) {
      if (!item["In-Stock"] || (item["In-Stock"] != 'true' && item["In-Stock"] != 'false')) {
        return false;
      }
    }
    return true;
  }
  numberValidate(obj) {
    for (let item of obj) {
      if (typeof item.Price !== 'number' || typeof item.Quantity !== 'number') {
        return false;
      }
    }
    return true;
  }
  emptyFieldsValidate(obj) {
    for (let item of obj) {
      if (!_.has(item, 'ID') ||
        !_.has(item, 'Name') ||
        !_.has(item, 'Price') ||
        !_.has(item, 'Quantity') ||
        !_.has(item, 'In-Stock')) {
        return false;
      }
    }
    return true;
  }
  isValidated(wb) {
    let sheet = wb.Sheets[wb.SheetNames[0]];
    this.upload_obj = XLSX.utils.sheet_to_json(sheet, { raw: true });

    if (this.headerValidate(sheet)) {
      this.isHeaderValid = true;
    }
    if (this.emptyFieldsValidate(this.upload_obj)) {
      this.isEmptyField = true;
    }
    if (this.stockValidate(this.upload_obj)) {
      this.isStockValid = true;
    }
    if (this.numberValidate(this.upload_obj)) {
      this.isNumberValid = true;
    }
  }
  uploadItems() {
    if (this.isHeaderValid && this.isEmptyField && this.isStockValid && this.isNumberValid) {
      let obj = this.upload_obj.map(item => {
        return {
          refId: item.ID,
          name: item.Name,
          price: item.Price,
          quantity: item.Quantity,
          description: item.Description,
          isInStock: item['In-Stock'],
          is_price_display: item['Display Price']
        }
      })

      this.authItemContributorService.uploadItems({ items: obj, category_id: this.category_id, currency: this.shop.currency }).pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(result => {
          this.close();
          this.sharedLoadingService.screenLoading.next({loading: true});

        })
    }
  }
  ngOnDestroy() {
    super.ngOnDestroy();
  }
}