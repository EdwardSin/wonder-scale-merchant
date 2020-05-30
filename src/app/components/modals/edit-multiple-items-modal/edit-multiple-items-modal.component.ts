import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { Tag } from '@objects/tag';
import { WsLoading } from '@elements/ws-loading/ws-loading';
import { WsModalComponent } from '@elements/ws-modal/ws-modal.component';

@Component({
  selector: 'edit-multiple-items-modal',
  templateUrl: './edit-multiple-items-modal.component.html',
  styleUrls: ['./edit-multiple-items-modal.component.scss']
})
export class EditMultipleItemsModalComponent extends WsModalComponent implements OnInit {
  @Input() isOpened: boolean;
  @Input() action: Function;
  @Input() editItems = [];
  tag: Tag = new Tag;
  isDisplayDiscount: boolean;
  isDiscount: boolean;
  isRelatedTag: boolean;
  loading: WsLoading = new WsLoading;

  constructor() {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
  }
  ngOnDestroy() {
    super.ngOnDestroy();
  }
  testing(event) {
    this.isDisplayDiscount = event.checked;
  }
}