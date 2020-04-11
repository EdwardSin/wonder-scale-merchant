import { Component, OnInit } from '@angular/core';
import { Title } from '@constants/title';
import { DocumentHelper } from '@helpers/documenthelper/document.helper';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    DocumentHelper.setWindowTitleWithWonderScale(Title.ABOUT_US);
  }

}
