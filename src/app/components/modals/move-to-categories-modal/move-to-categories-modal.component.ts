import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { WsModalClass } from '@elements/ws-modal/ws-modal';
import { WsModalService } from '@elements/ws-modal/ws-modal.service';

@Component({
  selector: 'move-to-categories-modal',
  templateUrl: './move-to-categories-modal.component.html',
  styleUrls: ['./move-to-categories-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MoveToCategoriesModalComponent extends WsModalClass implements OnInit {
  @Input() isOpened: boolean;
  @Input() action: Function;
  @Input() loading: Boolean = false;
  @Input() get editCategory() { return this._editCategory; }
  @Output() editCategoryChange: EventEmitter<any> = new EventEmitter;
  @Input() displayCategoryList = [];

  _editCategory: Object;

  set editCategory(val) {
    this._editCategory = val;
    this.editCategoryChange.emit(val);
  }
  constructor(modalService: WsModalService, el: ElementRef) {
    super(modalService, el);
  }

  ngOnInit() {
    super.ngOnInit();
  }
  ngOnDestroy() {
    super.ngOnDestroy();
  }
}
