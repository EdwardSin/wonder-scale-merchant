import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { WsLoading } from '@components/elements/ws-loading/ws-loading';
import { WsModalClass } from '@components/elements/ws-modal/ws-modal';
import { WsModalService } from '@components/elements/ws-modal/ws-modal.service';

@Component({
  selector: 'move-to-categories-modal',
  templateUrl: './move-to-categories-modal.component.html',
  styleUrls: ['./move-to-categories-modal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MoveToCategoriesModalComponent extends WsModalClass implements OnInit {
  @Input() action: Function;
  @Input() get editCategory() { return this._editCategory; }
  @Output() editCategoryChange: EventEmitter<any> = new EventEmitter;
  loading: WsLoading = new WsLoading;
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
