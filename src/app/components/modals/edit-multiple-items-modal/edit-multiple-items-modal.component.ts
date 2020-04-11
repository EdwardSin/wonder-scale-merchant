import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { Tag } from '@objects/tag';
import { WsLoading } from '@components/elements/ws-loading/ws-loading';
import { WsModalClass } from '@components/elements/ws-modal/ws-modal';
import { WsModalService } from '@components/elements/ws-modal/ws-modal.service';

@Component({
  selector: 'edit-multiple-items-modal',
  templateUrl: './edit-multiple-items-modal.component.html',
  styleUrls: ['./edit-multiple-items-modal.component.scss']
})
export class EditMultipleItemsModalComponent extends WsModalClass implements OnInit {
  @Input() action: Function;
  @Input() editItems = [];
  tag: Tag = new Tag;
  isDisplayDiscount: boolean;
  isDiscount: boolean;
  isRelatedTag: boolean;
  loading: WsLoading = new WsLoading;

  constructor(modalService: WsModalService, el: ElementRef) {
    super(modalService, el);
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