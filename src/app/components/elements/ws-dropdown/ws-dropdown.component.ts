import { Component, OnInit, Input, Output, EventEmitter, ViewChild, HostListener, ElementRef } from '@angular/core';

@Component({
  selector: 'ws-dropdown',
  templateUrl: './ws-dropdown.component.html',
  styleUrls: ['./ws-dropdown.component.scss']
})
export class WsDropdownComponent implements OnInit {

  // @Input() isOpen: Boolean = false;
  @Input() isAllowedCustomInput: Boolean = false;
  @Input() customValue: String = '';
  @Input() styles = {};
  @Input() class = '';
  @Input() items = [];
  @Input() placeholder = 'Enter value';

  @ViewChild('elementRef') elementRef: ElementRef;
  @Output() onItemClicked: EventEmitter<any> = new EventEmitter();
  @Output() isOpenChange: EventEmitter<any> = new EventEmitter();

  private _isOpen : boolean;

  @Input()
  set isOpen(isOpen: boolean) {
    this._isOpen = isOpen;
    this.isOpenChange.emit(this._isOpen);
  }

  get isOpen(): boolean { 
    return this._isOpen; 
  }

  constructor() { }

  ngOnInit() {
    document.getRootNode()
  }
  @HostListener('window:click', ['$event.target'])
  public onClick(targetElement){
    if (this.elementRef) {
      const clickedInside = this.elementRef.nativeElement.parentElement.parentElement.contains(targetElement);
      if(!clickedInside){
        this.isOpen = false;
      }
    }
  }
  
  selectItem(item) {
    this.customValue = '';
    this.isOpen = false;
    this.onItemClicked.emit(item);
  }
}