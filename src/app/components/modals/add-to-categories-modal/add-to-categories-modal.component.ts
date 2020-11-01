import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ArrayHelper } from '@helpers/arrayhelper/array.helper';
import _ from 'lodash';
import { WsModalComponent } from '@elements/ws-modal/ws-modal.component';

@Component({
  selector: 'add-to-categories-modal',
  templateUrl: './add-to-categories-modal.component.html',
  styleUrls: ['./add-to-categories-modal.component.scss']
})
export class AddToCategoriesModalComponent extends WsModalComponent implements OnInit {
  @Input() action: Function;
  @Input() loading: boolean;
  @Input() addingLoading: boolean;
  @Input() categories = [];
  @Input() get editCategoryList() { return this._editCategoryList; }
  _editCategoryList = [];
  @Output() editCategoryListChange: EventEmitter<any> = new EventEmitter;

  set editCategoryList(val) {
    this._editCategoryList = val;
    this.editCategoryListChange.emit(val);
  }

  constructor() {
    super();
  }

  ngOnInit() {
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
  ngOnDestroy() {
  }
}
