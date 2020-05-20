import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ArrayHelper } from '@helpers/arrayhelper/array.helper';
import { WsModalClass } from '@elements/ws-modal/ws-modal';
import { WsModalService } from '@elements/ws-modal/ws-modal.service';
import _ from 'lodash';

@Component({
  selector: 'add-to-categories-modal',
  templateUrl: './add-to-categories-modal.component.html',
  styleUrls: ['./add-to-categories-modal.component.scss']
})
export class AddToCategoriesModalComponent extends WsModalClass implements OnInit {
  @Input() isOpened: boolean;
  @Input() action: Function;
  @Input() loading: Boolean = false;
  @Input() displayCategoryList = [];
  @Input() get editCategoryList() { return this._editCategoryList; }
  @Output() editCategoryListChange: EventEmitter<any> = new EventEmitter;
  _editCategoryList = [];

  set editCategoryList(val) {
    this._editCategoryList = val;
    this.editCategoryListChange.emit(val);
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

  isCategoryInCategoryList(category) {
    var editCategoryList = this.editCategoryList;
    return _.includes(editCategoryList, category);
  }
  addToCategoryList(category) {
    var editCategoryList = this.editCategoryList;
    if (_.includes(editCategoryList, category)) {
      _.remove(editCategoryList, category);
    } else {
      editCategoryList.push(category);
    }
    this.editCategoryList = _.clone(this.editCategoryList);
  }
  deselectCategories() {
    ArrayHelper.clear(this.editCategoryList);
  }
}
