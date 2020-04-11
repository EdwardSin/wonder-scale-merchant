import { TestBed } from '@angular/core/testing';

import { RoutePartsService } from './route-parts.service';

describe('RoutePartsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RoutePartsService = TestBed.get(RoutePartsService);
    expect(service).toBeTruthy();
  });
});
