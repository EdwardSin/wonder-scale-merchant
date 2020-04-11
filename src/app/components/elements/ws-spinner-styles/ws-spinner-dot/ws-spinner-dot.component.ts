import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ws-spinner-dot',
  templateUrl: './ws-spinner-dot.component.html',
  styleUrls: ['./ws-spinner-dot.component.scss']
})
export class WsSpinnerDotComponent implements OnInit {
  @Input() color = "#000";
  @Input() size = "3.5";
  @Input() width = ".25";
  @Input() height = ".25";
  constructor() { }

  ngOnInit() {
  }

}
