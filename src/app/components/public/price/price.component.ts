import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VisitorGuard } from 'src/app/guards/visitor.guard';

@Component({
  selector: 'app-price',
  templateUrl: './price.component.html',
  styleUrls: ['./price.component.scss']
})
export class PriceComponent implements OnInit {

  constructor(private router: Router, private visitorGuard: VisitorGuard) { }

  ngOnInit(): void {
  }
  onPackageClicked(event) {
    this.visitorGuard.canActivate().then(result => {
      if (result) {
        this.router.navigate([], {queryParams: {modal: 'login', returnUrl: '/stores/all?modal=new-store&package=' + event}});
      } else {
        this.router.navigate(['/stores/all'], {queryParams:{modal: 'new-store', 'package': event}});
      }
    });
  }
}
