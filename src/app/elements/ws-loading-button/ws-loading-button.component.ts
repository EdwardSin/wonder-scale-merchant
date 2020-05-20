import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ws-loading-button',
  templateUrl: './ws-loading-button.component.html',
  styleUrls: ['./ws-loading-button.component.scss']
})
export class WsLoadingButtonComponent implements OnInit {
  @Input() type: string;
  @Input() class;
  @Input() disabled;
  @Input() loading: boolean;
  @Input() debounceClick;
  constructor() { }

  ngOnInit() {
  }

}
