import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ws-spinner-bar',
  templateUrl: './ws-spinner-bar.component.html',
  styleUrls: ['./ws-spinner-bar.component.scss']
})
export class WsSpinnerBarComponent implements OnInit {
  @Input() color: string = '#282c35';
  constructor() { }

  ngOnInit() {
  }

}
