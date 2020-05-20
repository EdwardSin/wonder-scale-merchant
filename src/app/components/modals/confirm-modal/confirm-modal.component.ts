import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { WsModalClass } from '@elements/ws-modal/ws-modal';
import { WsModalService } from '@elements/ws-modal/ws-modal.service';


@Component({
  selector: 'confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent extends WsModalClass implements OnInit {
  @Input() isOpened: boolean;
  @Input() header: string = "Confirmation";
  @Input() message: string;
  @Input() action: Function;
  @Input() closeCallback: Function;

  constructor(
    modalService: WsModalService, 
    el: ElementRef) {
    super(modalService, el);
  }
  ngOnInit() {
    super.ngOnInit();
  }
  ngOnDestroy() {
    super.ngOnDestroy();
  }
  close() {
    super.close();
    if (this.closeCallback) {
      this.closeCallback();
    }
  }
}
