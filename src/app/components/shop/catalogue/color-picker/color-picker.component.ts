import { Component, OnInit } from '@angular/core';
import { Color } from '@constants/colors';
// import { } from 'd3-color';

@Component({
  selector: 'color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss']
})
export class ColorPickerComponent implements OnInit {
  selectedColor = 'Red';
  colorName = 'Red';
  hexColor = 'red';
  colors = [{
    value: 'Red'
  }, {
    value: 'Green'
  }, {
    value: 'Navy'
  }, {
    value: 'Yellow'
  }, {
    value: 'Orange'
  }, {
    value: 'Purple'
  }, {
    value: 'Pink'
  }, {
    value: 'White'
  }, {
    value: 'Black'
  }]
  constructor() { }

  ngOnInit() {
  }
  changeColor(event) {
    let color = new Color;
    this.hexColor = event.srcElement.value;
    this.colorName = color.name(this.hexColor)[1].toString();
  }
}
