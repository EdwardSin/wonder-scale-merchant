import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
  selector: 'search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit {
  @Input() items;
  @Input() searchAttributes;
  @Input() placeholder = 'Search Item';
  @Input() action: Function;
  @Input() get result() { return this._result; }
  @Input() get searchKeyword() { return this._searchKeyword };
  @Output() resultChange: EventEmitter<any> = new EventEmitter;
  @Output() searchKeywordChange: EventEmitter<any> = new EventEmitter;

  _result: Array<any>;
  _searchKeyword: string;
  private ngUnsubscribe: Subject<any> = new Subject;

  constructor(private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
  }
  set result(val) {
    this._result = val;
    this.resultChange.emit(val);
  }
  set searchKeyword(val) {
    this._searchKeyword = val;
    this.searchKeywordChange.emit(val);
  }
  ngOnChanges(changes: SimpleChanges) {
    if(this.action) {
      this.action(this._searchKeyword);
    } else {
      if (changes['items']) {
        this.searchItem();
      }
    }
  }
  searchItem() {
    const allItems = this.items;
    let search_keyword = this.searchKeyword;
    if (search_keyword && search_keyword.trim() !== '' && allItems) {
      search_keyword = search_keyword.toLowerCase();
      let items = allItems.filter(x => {
        for (let attribute of this.searchAttributes) {
          if (typeof x[attribute] === typeof '') {
            let valid = x[attribute].toLowerCase().match(search_keyword);
            if (valid) {
              return valid;
            }
          }
          else if (typeof x[attribute] === typeof []) {
            for (let attr of x[attribute]) {
              let valid = attr.toLowerCase().toString().match(search_keyword);
              if (valid) {
                return valid;
              }
            }
          }
        }
      });
      this.result = items;
    }
    else {
      this.result = allItems;
    }
  }
  navigate() {
    let queryParams = {};
    if(this.searchKeyword) {
      queryParams = {...queryParams, s_keyword: this.searchKeyword, page: 1};
    } else {
      queryParams = {...queryParams, s_keyword: '', page: 1};
    }
    this.router.navigate([], { queryParams, queryParamsHandling: 'merge' });
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
