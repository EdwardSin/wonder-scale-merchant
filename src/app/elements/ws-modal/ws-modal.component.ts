import { Component, Input, OnInit, ViewEncapsulation, EventEmitter, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'ws-modal',
  templateUrl: './ws-modal.component.html',
  styleUrls: ['./ws-modal.component.scss'],//, '../../../../assets/scss/modal.scss'
  encapsulation: ViewEncapsulation.None
})
export class WsModalComponent implements OnInit {
  @Input() id: string;
  @Input() headerColor;
  @Input() noHeader: boolean;
  @Input() isCloseIconDisplayed: boolean = true;
  @Input() maxWidth: number = 800;
  @Input() closeCallback: Function;
  _isOpened: boolean;
  @Input() get isOpened() { return this._isOpened; }
  @Output() isOpenedChange: EventEmitter<boolean> = new EventEmitter;
  constructor() {
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
    this.isOpened = false;
    if (this.closeCallback) {
      this.closeCallback();
    }
  }
  closeOutside() {
    if (this.isCloseIconDisplayed) {
    }
  }
  ngOnDestroy() {
    let body = document.getElementsByTagName('body')
    if (body.length) {
      body[0].style.overflow = 'auto'; 
    }
  }
}
