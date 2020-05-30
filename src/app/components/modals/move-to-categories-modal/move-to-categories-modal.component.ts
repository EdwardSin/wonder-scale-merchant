import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { WsModalComponent } from '@elements/ws-modal/ws-modal.component';

@Component({
  selector: 'move-to-categories-modal',
  templateUrl: './move-to-categories-modal.component.html',
  styleUrls: ['./move-to-categories-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MoveToCategoriesModalComponent extends WsModalComponent implements OnInit {
  @Input() action: Function;
  @Input() loading: boolean = false;
  @Input() movingLoading: boolean;
  @Input() get editCategory() { return this._editCategory; }
  @Output() editCategoryChange: EventEmitter<any> = new EventEmitter;
  @Input() categories = [];

  _editCategory: Object;

  set editCategory(val) {
    this._editCategory = val;
    this.editCategoryChange.emit(val);
  }
  constructor() {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
  }
  ngOnDestroy() {
    super.ngOnDestroy();
  }
}
