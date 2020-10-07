import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { WsModalComponent } from '@elements/ws-modal/ws-modal.component';
import { WsToastService } from '@elements/ws-toast/ws-toast.service';
import { takeUntil } from 'rxjs/operators';
import * as XLSX from 'xlsx';
import { read, write } from 'xlsx';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { Subject } from 'rxjs';
import { AuthTableContributorService } from '@services/http/auth-store/ordering-contributor/auth-table-contributor.service';
import { SharedTableService } from '@services/shared/shared-table.service';

@Component({
  selector: 'import-tables-modal',
  templateUrl: './import-tables-modal.component.html',
  styleUrls: ['./import-tables-modal.component.scss']
})
export class ImportTablesModalComponent extends WsModalComponent implements OnInit {
  isUploaded: boolean;
  isRowExistance: boolean;
  isHeaderValid: boolean;
  isEmptyField: boolean;
  isNumberValid: boolean;
  isTableNoMaxLengthValid: boolean;
  isMaximumPersonsMaxValid: boolean;
  maxWidth: number = 500;
  upload_obj;
  category_id;
  invalidHeadersErrors = [];
  emptyFieldsErrors = [];
  numberFieldsErrors = [];
  tableNoMaxLengthErrors = [];
  maximumPersonsMaxErrors = [];
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
  constructor(private ref: ChangeDetectorRef,
    private sharedTableService: SharedTableService,
    private authTableContributorService: AuthTableContributorService) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
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
      if (!this.isNumberValid) {
        $(this.numberFieldsErrors.join(', ')).css({ 'background-color': '#33b5e5' });
      }
      if (!this.isTableNoMaxLengthValid) {
        $(this.tableNoMaxLengthErrors.join(', ')).css({ 'background-color': '#e58341' });
      }
      if (!this.isMaximumPersonsMaxValid) {
        $(this.maximumPersonsMaxErrors.join(', ')).css({ 'background-color': '#e9effc' });
      }
      if (!this.isEmptyField) {
        $(this.emptyFieldsErrors.join(', ')).css({ 'background-color': '#ffbb33' });
      }
      this.isPreviewLoading.stop();
      this.maxWidth = 600;
    };
    reader.readAsArrayBuffer(file);
    event.target.value = "";
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
    this.tableNoMaxLengthErrors = this.getTableNoMaxLengthFields(rows);
    this.maximumPersonsMaxErrors = this.getMaximumPersonsMaxFields(rows);
    this.isRowExistance = rows.length > 0;
    this.isHeaderValid = !this.invalidHeadersErrors.length;
    this.isEmptyField = !this.emptyFieldsErrors.length;
    this.isNumberValid = !this.numberFieldsErrors.length;
    this.isTableNoMaxLengthValid = !this.tableNoMaxLengthErrors.length;
    this.isMaximumPersonsMaxValid = !this.maximumPersonsMaxErrors.length;
    return this.isHeaderValid && this.isEmptyField && this.isNumberValid && this.isTableNoMaxLengthValid && this.isMaximumPersonsMaxValid;
  }
  isUploadValid() {
    return this.isRowExistance && this.isHeaderValid && this.isEmptyField && this.isNumberValid && this.isTableNoMaxLengthValid && this.isMaximumPersonsMaxValid;
  }
  getInvalidHeader(sheet) {
    let errors = [];
    if (!sheet['A1'] || sheet['A1'] && sheet['A1'].v != 'Table No') {
      errors.push('#sjs-A1');
    }
    if (!sheet['B1'] || sheet['B1'] && sheet['B1'].v != 'Maximum Persons') {
      errors.push('#sjs-B1');
    }
    return errors;
  }
  getEmptyFields(rows) {
    let errors = [];
    for (let i = 0; i < rows.length; i++) {
      let row = rows[i];
      let keys = Object.keys(row);
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
      if (typeof row['A'] != 'number') {
        errors.push('#sjs-A' + (i + 2));
      }
      if (typeof row['B'] != 'number') {
        errors.push('#sjs-B' + (i + 2));
      }
    }
    return errors;
  }
  getTableNoMaxLengthFields(rows) {
    let errors = [];
    for (let i = 0; i < rows.length; i++) {
      let row = rows[i];
      if (row['A'] && row['A'].length > 30) {
        errors.push('#sjs-A' + (i + 2));
      }
    }
    return errors;
  }
  getMaximumPersonsMaxFields(rows) {
    let errors = [];
    for (let i = 0; i < rows.length; i++) {
      let row = rows[i];
      if (row['B'] !== undefined && (+row['B'] < 1 || +row['B'] > 30)) {
        errors.push('#sjs-B' + (i + 2));
      }
    }
    return errors;
  }
  uploadItems() {
    this.isUploadLoading.start();
    let obj = this.upload_obj.map(item => {
      return {
        tableNo: item['Table No'],
        maxPersons: item['Maximum Persons']
      }
    })
    this.authTableContributorService.uploadTables({tables: obj}).pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => {
        this.phase = 1;
        this.maxWidth = 400;
        this.isUploadLoading.stop();
        this.sharedTableService.refreshTables.next(true);
      }, err => {
        WsToastService.toastSubject.next({ content: err.error.message || 'Error when uploading items!', type: 'danger' });
        this.isUploadLoading.stop();
      })
  }
  ngOnDestroy() {
    super.ngOnDestroy();
  }
}
