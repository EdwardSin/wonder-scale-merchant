import { Injectable } from '@angular/core';
import { Item } from '@objects/item';
import { BehaviorSubject } from 'rxjs';
import * as _ from 'lodash';

@Injectable({
    providedIn: 'root'
})
export class SharedItemService {
    displayItems: BehaviorSubject<Item[]> = new BehaviorSubject<Item[]>([]);
    editItems: BehaviorSubject<Item[]> = new BehaviorSubject<Item[]>([]);
    _columns = sessionStorage.getItem('shownColumns') || '["id", "name", "price", "discount", "uploaded_images", "status"]';
    shownColumns: BehaviorSubject<Array<string>> = new BehaviorSubject<Array<string>>(JSON.parse(this._columns));

    _allItems: Item[] = [];
    _displayItems: Item[] = [];
    _editItems: Item[] = [];

    constructor() { }

    selectItems() {
        let items = _.unionBy([...this.editItems.getValue(), ...this.displayItems.getValue()], '_id');
        this.editItems.next(items);
    }
    deselectItems() {
        let items = this.editItems.getValue();
        let displayItems = this.displayItems.getValue();
        if (displayItems) {
            items = items.filter(item => !displayItems.find(_item => _item._id == item._id));
        }
        this.editItems.next(items);
    }
    deselectAll() {
        this.editItems.next([]);
    }
    addToItemList(item) {
        this._editItems = this.editItems.getValue();
        if (this._editItems.find(x => item._id === x._id)) {
            this._editItems = this._editItems.filter(_editItem => _editItem._id != item._id);
        } else {
            this._editItems.push(item);
        }
        this.editItems.next(this._editItems);
    }
}
