import { Component, OnInit } from '@angular/core';
import { DocumentHelper } from '@helpers/documenthelper/document.helper';
import { Router } from '@angular/router';
import { VisitorGuard } from 'src/app/guards/visitor.guard';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('openClose', [
      state('open', style({
        opacity: 1
      })),
      state('closed', style({
        opacity: 0
      })),
      transition('void => *', [style({opacity: '0'}), animate('500ms')])
    ]),
  ],
})
export class HomeComponent implements OnInit {


  year = new Date().getFullYear();
  selectedTab = 'qrcode';
  selectedType: string = 'restaurant';
  constructor(private router: Router,
    private visitorGuard: VisitorGuard) { }

  ngOnInit() {
    DocumentHelper.setWindowTitleWithWonderScale('Merchant');
  }
  navigateToJoinUs() {
    this.visitorGuard.canActivate().then(result => {
      if (result) {
        this.router.navigate([], {queryParams: {modal: 'login', returnUrl: '/stores/all?modal=new-store'}});
      } else {
        this.router.navigate(['/stores/all'], {queryParams:{modal: 'new-store'}});
      }
    })
  }
  selectType(type) {
    this.selectedType = type;
  }
}
