import { Component, Input, OnInit, ViewEncapsulation, EventEmitter, Output, SimpleChanges, HostListener, ViewChild, ElementRef } from '@angular/core';

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
  @Input() isClosedOutside: boolean = true;
  @Input() isPreviousIconDisplayed: boolean = false;
  @Input() previousCallback: Function;
  _isOpened: boolean;
  @Input() get isOpened() { return this._isOpened; }
  @Output() isOpenedChange: EventEmitter<boolean> = new EventEmitter;
  @ViewChild('wsModalBody', {static: true}) modalBody: ElementRef;
  set isOpened(val) {
    this._isOpened = val;
    this.isOpenedChange.emit(val);
  }
  
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
  close() {
    this.isOpened = false;
    if (this.closeCallback) {
      this.closeCallback();
    }
  }
  closeOutside(event) {
    const clickedOutside = event.target.contains(this.modalBody.nativeElement);
    if (clickedOutside && this.isClosedOutside) {
      this.isOpened = false;
      if (this.closeCallback) {
        this.closeCallback();
      }
    }
  }
  onPreviousClick() {
    if (this.previousCallback) {
      this.previousCallback();
    }
  }
  ngOnDestroy() {
    let body = document.getElementsByTagName('body')
    if (body.length) {
      body[0].style.overflow = 'auto'; 
    }
  }
}
