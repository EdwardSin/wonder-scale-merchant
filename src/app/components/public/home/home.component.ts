import { Component, OnInit } from '@angular/core';
import { DocumentHelper } from '@helpers/documenthelper/document.helper';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {


  year = new Date().getFullYear();
  constructor() { }

  ngOnInit() {
    DocumentHelper.setWindowTitleWithWonderScale('Merchant');
  }

}
