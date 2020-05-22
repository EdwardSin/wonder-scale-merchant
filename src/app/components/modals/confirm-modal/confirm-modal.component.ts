import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { WsModalComponent } from '@elements/ws-modal/ws-modal.component';


@Component({
  selector: 'confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent extends WsModalComponent implements OnInit {
  @Input() isOpened: boolean;
  @Input() header: string = "Confirmation";
  @Input() message: string;
  @Input() action: Function;
  @Input() closeCallback: Function;

  constructor() {
    super();
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
