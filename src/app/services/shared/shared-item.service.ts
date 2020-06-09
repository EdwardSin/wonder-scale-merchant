import { Injectable } from '@angular/core';
import { Item } from '@objects/item';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class SharedItemService {
    displayItems: BehaviorSubject<Item[]> = new BehaviorSubject<Item[]>([]);
    editItems: BehaviorSubject<Item[]> = new BehaviorSubject<Item[]>([]);
    _columns = sessionStorage.getItem('shownColumns') || '["id", "name", "price", "discount", "status"]';
    shownColumns: BehaviorSubject<Array<string>> = new BehaviorSubject<Array<string>>(JSON.parse(this._columns));

    _allItems: Item[] = [];
    _displayItems: Item[] = [];
    _editItems: Item[] = [];

    constructor() { }

    selectAll() {
        this.editItems.next([...this.displayItems.getValue()]);
    }
    deselectAll() {
        this.editItems.next([]);
    }
    addToItemList(item) {
        this._editItems = this.editItems.getValue();
        if (this._editItems.findIndex(x => item._id === x['_id']) > -1) {
            this._editItems.splice(this._editItems.indexOf(item), 1);
        } else {
            this._editItems.push(item);
        }
        this.editItems.next(this._editItems);
    }
}
