import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatSelect } from '@angular/material/select';
import { WsLoading } from '@elements/ws-loading/ws-loading';

@Component({
  selector: 'ws-search-select',
  templateUrl: './ws-search-select.component.html',
  styleUrls: ['./ws-search-select.component.scss']
})
export class WsSearchSelectComponent implements OnInit {

  @Input() items = [];
  @Input() loading: boolean;
  @Input() placeholder: string = '';
  @Output() searchValueChange: EventEmitter<any> = new EventEmitter();
  @Output() selectionChange: EventEmitter<any> = new EventEmitter<any>();
  @Output('scroll') scrollChange: EventEmitter<any> = new EventEmitter<any>();
  @Output('open') openChange: EventEmitter<any> = new EventEmitter<any>();
  
  @ViewChild('matSelectInfiniteScroll', { static: true } )
  infiniteScrollSelect: MatSelect;
  searchCtrl: FormControl = new FormControl();
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor() { 
    this.searchCtrl.valueChanges.pipe(takeUntil(this.ngUnsubscribe)).subscribe(result => {
      this.searchValueChange.emit(result);
    });
  }

  ngOnInit() {
    this.infiniteScrollSelect.openedChange.pipe(takeUntil(this.ngUnsubscribe)).subscribe(opened => {
      // after opening, reset the batch offset
      this.openChange.emit(opened);
    });
  }
  selectItem(event) {
    let data = this.items.find(data => {
      return data._id == event.value
    });
    this.selectionChange.emit(data);
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  /**
   * Load the next batch
   */
  getNextBatch(): void {
    this.scrollChange.emit(true);
  }
}