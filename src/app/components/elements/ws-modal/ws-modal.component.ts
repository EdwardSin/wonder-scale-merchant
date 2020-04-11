import { Component, ElementRef, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { WsModalService } from './ws-modal.service';
import { WsModalClass } from './ws-modal';

@Component({
  selector: 'ws-modal',
  templateUrl: './ws-modal.component.html',
  styleUrls: ['./ws-modal.component.scss'],//, '../../../../assets/scss/modal.scss'
  encapsulation: ViewEncapsulation.None
})
export class WsModalComponent extends WsModalClass implements OnInit {
  @Input() headerColor;
  @Input() noHeader: boolean;
  @Input() clickClose: boolean = true;
  @Input() maxWidth: number = 800;
  constructor(modalService: WsModalService,
    el: ElementRef) {
    super(modalService, el);
  }
  ngOnInit() {
  }
  ngOnDestroy() {
  }
  close() {
    this.modalService.close(this.id);
  }
  closeOutside() {
    if (this.clickClose) {
      this.modalService.close(this.id);
    }
  }
}
