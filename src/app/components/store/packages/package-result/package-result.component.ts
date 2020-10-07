import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedStoreService } from '@services/shared/shared-store.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'package-result',
  templateUrl: './package-result.component.html',
  styleUrls: ['./package-result.component.scss']
})
export class PackageResultComponent implements OnInit {
  @Input() selectedPackage;
  private ngUnsubscribe: Subject<any> = new Subject();
  constructor(private sharedStoreService: SharedStoreService,
    private router: Router) { 
  }

  ngOnInit(): void {
  }
  navigateToContinue() {
    this.router.navigate(['/stores', this.sharedStoreService.store.getValue().username, 'dashboard']);
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
