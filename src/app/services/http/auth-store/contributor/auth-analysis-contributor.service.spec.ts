import { TestBed } from '@angular/core/testing';

import { AuthAnalysisContributorService } from './auth-analysis-contributor.service';

describe('AuthAnalysisContributorService', () => {
  let service: AuthAnalysisContributorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthAnalysisContributorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
