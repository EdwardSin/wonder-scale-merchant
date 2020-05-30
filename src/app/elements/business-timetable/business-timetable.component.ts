import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Timetable } from '@objects/ws-timetable';

@Component({
  selector: 'business-timetable',
  templateUrl: './business-timetable.component.html',
  styleUrls: ['./business-timetable.component.scss']
})
export class BusinessTimetableComponent implements OnInit {

  @Input() get timetable() { return this._timetable };
  @Output() timetableChange: EventEmitter<any> = new EventEmitter;
  days = Timetable.days;
  _timetable: Timetable;
  set timetable(val) {
    this._timetable = val;
    this.timetableChange.emit(val);
  }

  constructor() {
  }

  ngOnInit() {
  }
  itemChange(event) {
    this.timetable.operatingHourRadio = event.value;
  }
  focusOutTimetable() {
    this.timetable.validate();
  }
}