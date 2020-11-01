import { Component, OnInit } from '@angular/core';
import { SharedCategoryService } from '@services/shared/shared-category.service';

@Component({
  selector: 'app-catalogue',
  templateUrl: './catalogue.component.html',
  styleUrls: ['./catalogue.component.scss']
})
export class CatalogueComponent implements OnInit {
  constructor(private sharedCategoryService: SharedCategoryService) { }
  ngOnInit() {
    this.sharedCategoryService.refreshCategories(() => {}, false, false);
  }
}
