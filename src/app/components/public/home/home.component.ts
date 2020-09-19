import { Component, OnInit } from '@angular/core';
import { DocumentHelper } from '@helpers/documenthelper/document.helper';
import { Router } from '@angular/router';
import { VisitorGuard } from 'src/app/guards/visitor.guard';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {


  year = new Date().getFullYear();
  selectedType: string = 'restaurant';
  constructor(private router: Router,
    private visitorGuard: VisitorGuard) { }

  ngOnInit() {
    DocumentHelper.setWindowTitleWithWonderScale('Merchant');
  }
  navigateToJoinUs() {
    this.visitorGuard.canActivate().then(result => {
      if (result) {
        this.router.navigate([], {queryParams: {modal: 'login', returnUrl: '/shops/all?modal=new-shop'}});
      } else {
        this.router.navigate(['/shops/all'], {queryParams:{modal: 'new-shop'}});
      }
    })
  }
  selectType(type) {
    this.selectedType = type;
  }
}
