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
