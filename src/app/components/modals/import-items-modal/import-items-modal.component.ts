import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthItemContributorService } from '@services/http/auth-shop/contributor/auth-item-contributor.service';
import { SharedShopService } from '@services/shared/shared-shop.service';
import _ from 'lodash';
import { takeUntil } from 'rxjs/operators';
import * as XLSX from 'xlsx';
import { read, write } from 'xlsx';
import { Subject } from 'rxjs';
import { WsModalComponent } from '@elements/ws-modal/ws-modal.component';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { SharedItemService } from '@services/shared/shared-item.service';
import { SharedCategoryService } from '@services/shared/shared-category.service';
import { WsToastService } from '@elements/ws-toast/ws-toast.service';

@Component({
  selector: 'import-items-modal',
  templateUrl: './import-items-modal.component.html',
  styleUrls: ['./import-items-modal.component.scss']
})



export class ImportItemsModalComponent extends WsModalComponent implements OnInit {
  isUploaded: boolean;
  isRowExistance: boolean;
  isHeaderValid: boolean;
  isEmptyField: boolean;
  isStockValid: boolean;
  isNumberValid: boolean;
  isNameMaxLengthValid: boolean;
  isMaxLengthValid: boolean;
  maxWidth: number = 800;
  upload_obj;
  shop;
  category_id;
  invalidHeadersErrors = [];
  emptyFieldsErrors = [];
  numberFieldsErrors = [];
  nameMaxLengthErrors = [];
  maxLengthErrors = [];
  isUploadLoading: WsLoading = new WsLoading;
  isPreviewLoading: WsLoading = new WsLoading;
  phase: number = 0;
  isEntityNew: boolean;
  isPublished: boolean;
  categories = [];
  selectedCategories = [];

  private ngUnsubscribe: Subject<any> = new Subject;
  @ViewChild('tableView', { static: true }) tableView: ElementRef;
  constructor(
    private ref: ChangeDetectorRef,
    private authItemContributorService: AuthItemContributorService,
    private sharedShopService: SharedShopService,
    private sharedCategoryService: SharedCategoryService) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    this.sharedShopService.shop.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        if (result) {
          this.shop = result;
        }
      })
    this.sharedCategoryService.categories.pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(result => {
      this.categories = result;
    })
  }
  importFileChangeEvent(event) {
    this.isUploaded = true;
    this.ref.detectChanges();

    let files = event.target.files;
    if (!files || files.length == 0) return;
    let file = files[0];
    let reader = new FileReader();
    this.category_id = event.category_id;
    this.isPreviewLoading.start();
    reader.onload = (e) => {
      const csv: string | ArrayBuffer = <ArrayBuffer>reader.result;
      let data = new Uint8Array(csv);
      this.ref.detectChanges();
      let wb = read(data, { type: 'array', raw: true });
      let sheet = wb.Sheets[wb.SheetNames[0]];
      let htmlstr = XLSX.utils.sheet_to_html(sheet, {editable: false});
      try {
        this.isValidated(wb);
      }
      catch (err) {
        console.log(err);
      }
      document.getElementById('tableView').innerHTML = '';
      document.getElementById('tableView').innerHTML += htmlstr;
      document.querySelector('#tableView table').classList.add("table", "table-sm", "mb-0", "table-bordered");
      if (!this.isHeaderValid) {
        $(this.invalidHeadersErrors.join(', ')).css({ 'background-color': '#ff9999' });
      }
      if (!this.isEmptyField) {
        $(this.emptyFieldsErrors.join(', ')).css({ 'background-color': '#ffbb33' });
      }
      if (!this.isNumberValid) {
        $(this.numberFieldsErrors.join(', ')).css({ 'background-color': '#33b5e5' });
      }
      if (!this.isNameMaxLengthValid) {
        $(this.nameMaxLengthErrors.join(', ')).css({ 'background-color': '#e58341' });
      }
      if (!this.isMaxLengthValid) {
        $(this.maxLengthErrors.join(', ')).css({ 'background-color': '#6699ff' });
      }
      this.isPreviewLoading.stop();
    };
    reader.readAsArrayBuffer(file);
  }
  isValidated(wb) {
    let sheet = wb.Sheets[wb.SheetNames[0]];
    this.upload_obj = XLSX.utils.sheet_to_json(sheet, { raw: true, blankrows: false, defval: '' });
    var range = XLSX.utils.decode_range(sheet['!ref']);
    range.s.r = 1; // <-- zero-indexed, so setting to 1 will skip row 0
    sheet['!ref'] = XLSX.utils.encode_range(range);
    let rows = XLSX.utils.sheet_to_json(sheet, { raw: true, header: 'A', blankrows: false, defval: '' });
    this.invalidHeadersErrors = this.getInvalidHeader(sheet);
    this.emptyFieldsErrors = this.getEmptyFields(rows);
    this.numberFieldsErrors = this.getInvalidNumberFields(rows);
    this.nameMaxLengthErrors = this.getNameMaxLengthFields(rows);
    this.maxLengthErrors = this.getMaxLengthFields(rows);
    this.isRowExistance = rows.length > 0;
    this.isHeaderValid = !this.invalidHeadersErrors.length;
    this.isEmptyField = !this.emptyFieldsErrors.length;
    this.isNumberValid = !this.numberFieldsErrors.length;
    this.isNameMaxLengthValid = !this.nameMaxLengthErrors.length;
    this.isMaxLengthValid = !this.maxLengthErrors.length;
    return this.isHeaderValid && this.isEmptyField && this.isNumberValid && this.isNameMaxLengthValid && this.isMaxLengthValid;
  }
  isUploadValid() {
    return this.isRowExistance && this.isHeaderValid && this.isEmptyField && this.isNumberValid && this.isNameMaxLengthValid && this.isMaxLengthValid;
  }
  getInvalidHeader(sheet) {
    let errors = [];
    if (!sheet['A1'] || sheet['A1'] && sheet['A1'].v != 'SKU ID') {
      errors.push('#sjs-A1');
    }
    if (!sheet['B1'] || sheet['B1'] && sheet['B1'].v != 'Name') {
      errors.push('#sjs-B1');
    }
    if (!sheet['C1'] || sheet['C1'] && sheet['C1'].v != 'Price') {
      errors.push('#sjs-C1');
    }
    if (!sheet['D1'] || sheet['D1'] && sheet['D1'].v != 'Description') {
      errors.push('#sjs-D1');
    }
    return errors;
  }
  getEmptyFields(rows) {
    let errors = [];
    for (let i = 0; i < rows.length; i++) {
      let row = rows[i];
      let keys = Object.keys(row);
      keys = keys.filter(x => x != 'D');
      for (let key of keys) {
        if (row[key] === undefined || row[key] === null || row[key].toString().trim() === '') {
          errors.push('#sjs-' + key + (i + 2));
        }
      }
    }
    return errors;
  }
  getInvalidNumberFields(rows) {
    let errors = [];
    for (let i = 0; i < rows.length; i++) {
      let row = rows[i];
      if (typeof row['C'] != 'number') {
        errors.push('#sjs-C' + (i + 2));
      }
    }
    return errors;
  }
  getNameMaxLengthFields(rows) {
    let errors = [];
    for (let i = 0; i < rows.length; i++) {
      let row = rows[i];
      if (row['B'] && row['B'].length > 128) {
        errors.push('#sjs-B' + (i + 2));
      }
    }
    return errors;
  }
  getMaxLengthFields(rows) {
    let errors = [];
    for (let i = 0; i < rows.length; i++) {
      let row = rows[i];
      if (row['D'] && row['D'].length > 256) {
        errors.push('#sjs-D' + (i + 2));
      }
    }
    return errors;
  }
  uploadItems() {
    this.isUploadLoading.start();
    let obj = this.upload_obj.map(item => {
      return {
        refId: item['SKU ID'],
        name: item['Name'],
        price: item['Price'],
        description: item['Description'],
        categories: this.selectedCategories,
        isEntityNew: this.isEntityNew,
        isPublished: this.isPublished
      }
    })
    //this.shop.currency
    this.authItemContributorService.uploadItems({ items: obj, category_id: this.category_id, currency: 'MYR' }).pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        this.sharedCategoryService.refreshCategories(() => {
          this.phase = 1;
          this.maxWidth = 400;
          this.isUploadLoading.stop();
        });
      }, err => {
        WsToastService.toastSubject.next({ content: err.error.message || 'Error when uploading items!', type: 'danger' });
        this.isUploadLoading.stop();
      })
  }
  ngOnDestroy() {
    super.ngOnDestroy();
  }
}