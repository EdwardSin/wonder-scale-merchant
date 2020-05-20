import { Component, OnInit, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'ws-loading-screen',
  templateUrl: './ws-loading-screen.component.html',
  styleUrls: ['./ws-loading-screen.component.scss']
})
export class WsLoadingScreenComponent implements OnInit {
  @Input() label: string = 'Loading...';
  constructor() { }

  ngOnInit() {
  }
  ngOnChanges(changes: SimpleChanges) {
    if(changes['label'] && !this.label) {
      this.label = 'Loading...';
    }
  }
}
