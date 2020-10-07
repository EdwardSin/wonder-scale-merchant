import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedPackageService } from '@services/shared/shared-package.service';
import { VisitorGuard } from 'src/app/guards/visitor.guard';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss']
})
export class PricingComponent implements OnInit {

  constructor(private router: Router,
    private sharedPackageService: SharedPackageService,
    private visitorGuard: VisitorGuard) { }

  ngOnInit(): void {
  }

  navigateToJoinUs() {
    this.visitorGuard.canActivate().then(result => {
      this.sharedPackageService.selectedPackage.next(this.sharedPackageService.getTrialPackage());
      if (result) {
        this.router.navigate([], {queryParams: {modal: 'login', returnUrl: '/stores/all?modal=new-store'}});
      } else {
        this.router.navigate(['/stores/all'], {queryParams:{modal: 'new-store'}});
      }
    })
  }

}
