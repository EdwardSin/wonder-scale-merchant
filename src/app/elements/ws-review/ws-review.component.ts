import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { environment } from '@environments/environment';

@Component({
  selector: 'ws-review',
  templateUrl: './ws-review.component.html',
  styleUrls: ['./ws-review.component.scss']
})
export class WsReviewComponent implements OnInit {
  @Input() item;
  @Input() isDetails: boolean = false;
  isOpened: boolean;
  environment = environment;
  constructor() { }


  ngOnInit(): void {
  }

}
