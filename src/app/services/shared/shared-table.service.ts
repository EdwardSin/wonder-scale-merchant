import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as _ from 'lodash';
import Table from '@objects/table';

@Injectable({
    providedIn: 'root'
})
export class SharedTableService {
    refreshTables: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    constructor() { }
}
