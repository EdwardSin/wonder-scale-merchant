import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ws-loading',
  templateUrl: './ws-loading.component.html',
  styleUrls: ['./ws-loading.component.scss']
})
export class WsLoadingComponent implements OnInit {
  @Input() loadingStyle: LoadingStyle = 'h-dot';
  constructor() { }

  ngOnInit() {
  }

}

type LoadingStyle = 'dot' | 'bar' | 'normal' | 'h-dot';
