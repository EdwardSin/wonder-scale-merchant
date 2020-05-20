import { Component, ElementRef, Input, OnInit, ViewEncapsulation, EventEmitter, Output, SimpleChanges } from '@angular/core';
import { WsModalService } from './ws-modal.service';
import { WsModalClass } from './ws-modal';

@Component({
  selector: 'ws-modal',
  templateUrl: './ws-modal.component.html',
  styleUrls: ['./ws-modal.component.scss'],//, '../../../../assets/scss/modal.scss'
  encapsulation: ViewEncapsulation.None
})
export class WsModalComponent extends WsModalClass implements OnInit {
  @Input() id: string;
  @Input() headerColor;
  @Input() noHeader: boolean;
  @Input() isCloseIconDisplayed: boolean = true;
  @Input() maxWidth: number = 800;
  _isOpened: boolean;
  @Input() get isOpened() { return this._isOpened; }
  @Output() isOpenedChange: EventEmitter<boolean> = new EventEmitter;
  constructor(modalService: WsModalService,
    el: ElementRef) {
    super(modalService, el);
  }
  ngOnInit() {
  }
  ngOnChanges(changes: SimpleChanges){
    if(changes['isOpened']) {
      let body = document.getElementsByTagName('body')
      if (body.length) {
        body[0].style.overflow = this.isOpened ? 'hidden' : 'auto'; 
      }
    }
  }
  set isOpened(val) {
    this._isOpened = val;
    this.isOpenedChange.emit(val);
  }
  close() {
    this.modalService.close(this.id);
  }
  closeOutside() {
    if (this.isCloseIconDisplayed) {
      this.modalService.close(this.id);
    }
  }
  ngOnDestroy() {
    let body = document.getElementsByTagName('body')
    if (body.length) {
      body[0].style.overflow = 'auto'; 
    }
  }
}
