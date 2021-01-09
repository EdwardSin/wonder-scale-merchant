import { Component, OnInit } from '@angular/core';
import { DocumentHelper } from '@helpers/documenthelper/document.helper';
import { SharedStoreService } from '@services/shared/shared-store.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-accounting',
  templateUrl: './accounting.component.html',
  styleUrls: ['./accounting.component.scss']
})
export class AccountingComponent implements OnInit {

  private ngUnsubscribe: Subject<any> = new Subject;
  constructor(
    private sharedStoreService: SharedStoreService
  ) { }

  ngOnInit(): void {
    this.sharedStoreService.store.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      if (result) {
        DocumentHelper.setWindowTitleWithWonderScale('Accounting - ' + result.name);
      }
    });
  }

}
