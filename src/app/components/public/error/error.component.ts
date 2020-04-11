import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {
  error: { title: string, message: string };
  constructor(private location: Location) {
    this.error = {
      title: '404 Page not found',
      message: 'The page is currently not found, please view other page!'
    }
  }
  ngOnInit() {
  }
  back() {
    this.location.back();
  }
}
