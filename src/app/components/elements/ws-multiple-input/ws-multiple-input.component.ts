import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import _ from 'lodash';
@Component({
  selector: 'ws-multiple-input',
  templateUrl: './ws-multiple-input.component.html',
  styleUrls: ['./ws-multiple-input.component.scss']
})
export class WsMultipleInputComponent implements OnInit {
  @Input() get items(){return this._items;};
  @Input() maxItems: number;
  @Input() type: string = 'text';
  @Input() name: string;
  @Input() placeholder: string;
  @Input() removeColCallback: Function;
  @Output() itemsChange: EventEmitter<any> = new EventEmitter;
  @ViewChildren('itemInput') itemInput: QueryList<any> = new QueryList;
  private _items:Array<any> = [''];

  set items(val){
    this._items = val;
    this.itemsChange.emit(val);
  }
  
  constructor(private ref: ChangeDetectorRef) { }
  
  ngOnInit() {
  }

  itemChange(event, i){
    this.items[i] = event;
    this.items = _.clone(this.items);
  }
  addCol(){
    this.items.push('');
    this.ref.detectChanges();
    this.items = _.clone(this.items);
    this.itemInput.last.nativeElement.focus();
  }
  removeCol(item){
    this.items.splice(this.items.indexOf(item), 1);
    this.ref.detectChanges();
    this.itemInput.last.nativeElement.focus();
    this.items = _.clone(this.items);
    if(this.removeColCallback){
      this.removeColCallback();
    }
  }
  trackByFn(index: any, item: any) {
    return index;
 }
 
}