import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ColorService {
  colors = [{
    name: 'red',
    value: 'red'
  }, {
    name: 'green',
    value: 'green'
  }, {
    name: 'navy',
    value: 'navy'
  }, {
    name: 'yellow',
    value: 'yellow'
  }, {
    name: 'orange',
    value: 'orange'
  }, {
    name: 'purple',
    value: 'purple'
  }, {
    name: 'pink',
    value: 'pink'
  }, {
    name: 'white',
    value: 'white'
  }, {
    name: 'black',
    value: 'black'
  }]
  constructor() { }
}
