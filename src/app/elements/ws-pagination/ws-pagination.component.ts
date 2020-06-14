import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'ws-pagination',
  templateUrl: './ws-pagination.component.html',
  styleUrls: ['./ws-pagination.component.scss']
})
export class WsPaginationComponent implements OnInit {
  @Input() expanded: Boolean = false;
  @Input() pageSize: number = 20;
  @Input() total: number = 0;
  @Input() dbTotal: number = 0;
  @Input() numberOfSelectedItems: number = 0;
  @Input() currentPage: number = 1;
  @Output() getPageNumber = new EventEmitter();
  @Output() deselectAll = new EventEmitter();
  currentDisplayTotal: number = 0;
  pager: any = {};
  constructor() { }

  ngOnInit(): void {
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['total'] && !!this.total) {
      this.setPage(this.currentPage);
      this.pager.currentPage = this.currentPage;
      if (changes['total'] && !!this.total) {
        this.updateCurrentDisplayTotal();
      }
    }
    if (changes['currentPage'] && !!this.currentPage) {
      this.updateCurrentDisplayTotal();
    }
  }
  updateCurrentDisplayTotal() {
    if (Math.ceil(this.total / this.pageSize) == this.currentPage) {
      this.currentDisplayTotal = this.pageSize * (this.currentPage - 1) + this.total % this.pageSize;
      if (this.total != 0 && this.total % this.pageSize == 0) {
        this.currentDisplayTotal += this.pageSize;
      }
    } else if (this.pageSize >= this.total) {
      this.currentDisplayTotal = this.total * this.currentPage;
    } else {
      this.currentDisplayTotal = this.pageSize * this.currentPage;
    }
  }
  getPager(totalItems: number, currentPage: number = 1, pageSize: number = 20) {
    // calculate total pages

    let totalPages = Math.ceil(totalItems / pageSize);

    let startPage: number, endPage: number;
    if (totalPages <= 10) {
      // less than 10 total pages so show all
      startPage = 1;
      endPage = totalPages;
    } else {
      // more than 10 total pages so calculate start and end pages
      if (currentPage <= 6) {
        startPage = 1;
        endPage = 10;
      } else if (currentPage + 4 >= totalPages) {
        startPage = totalPages - 9;
        endPage = totalPages;
      } else {
        startPage = currentPage - 5;
        endPage = currentPage + 4;
      }
    }
    // calculate start and end item indexes
    let startIndex = (currentPage - 1) * pageSize;
    let endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

    // create an array of pages to ng-repeat in the pager control
    let pages = _.range(startPage, endPage + 1);
    //console.log(startIndex);

    // return object with all pager properties required by the view
    return {
      totalItems: totalItems,
      currentPage: currentPage,
      pageSize: pageSize,
      totalPages: totalPages,
      startPage: startPage,
      endPage: endPage,
      startIndex: startIndex,
      endIndex: endIndex,
      pages: pages
    };
  }

  setPage(page: number) {
    if (page < 1 || page > this.pager.totalPages) {
      return;
    }
    // get pager object from service

    this.pager = this.getPager(this.total, page, this.pageSize);

    // get current page of items
    //this.displayItems = this.items.slice(this.pager.startIndex, this.pager.endIndex + 1);
    this.getPageNumber.emit(page);
  }
}
