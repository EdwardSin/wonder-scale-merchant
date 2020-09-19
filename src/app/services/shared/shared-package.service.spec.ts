import { TestBed } from '@angular/core/testing';

import { SharedPackageService } from './shared-package.service';

describe('SharedPackageService', () => {
  let service: SharedPackageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedPackageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
