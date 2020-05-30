import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ws-spinner',
  templateUrl: './ws-spinner.component.html',
  styleUrls: ['./ws-spinner.component.scss']
})
export class WsSpinnerComponent implements OnInit {
  @Input() width: number = 30;
  @Input() height: number = 30;
  @Input() borderWidth: number = 5;
  @Input() spinnerColor: string;
  constructor() { }

  ngOnInit() {
  }

}
