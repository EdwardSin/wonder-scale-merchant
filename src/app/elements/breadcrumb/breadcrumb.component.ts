import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { RoutePartsService } from '@services/general/route-parts.service';
import { SharedStoreService } from '@services/shared/shared-store.service';

@Component({
  selector: 'breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {
  routeParts:any[];
  store;
  constructor(
    private router: Router,
    private sharedStoreService: SharedStoreService,
    private routePartsService: RoutePartsService, 
    private activeRoute: ActivatedRoute
  ) {
    this.store = this.sharedStoreService.store.getValue();
    this.routeParts = this.routePartsService.generateRouteParts(this.activeRoute.snapshot);
    this.generateUrlFromParts();

    this.router.events.subscribe((event) => {
      if(event instanceof NavigationEnd){
        this.routeParts = this.routePartsService.generateRouteParts(this.activeRoute.snapshot);
        this.generateUrlFromParts();
      }
    });
  }

  ngOnInit() {}
  generateUrlFromParts() {
    // generate url from parts
    this.routeParts.reverse().map((item, i) => {
      item.breadcrumb = RoutePartsService.parseText(item);
      item.urlSegments.forEach((urlSegment, j) => {
        if(j === 0)
          return item.url = `${urlSegment.path}`;
        item.url += `/${urlSegment.path}`
      });
      if(i === 0) {
        return item;
      }
      // prepend previous part to current part
      item.url = `${this.routeParts[i - 1].url}/${item.url}`;
      return item;
    });
  }
}
