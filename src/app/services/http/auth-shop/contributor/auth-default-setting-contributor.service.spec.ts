import { TestBed } from '@angular/core/testing';

import { AuthDefaultSettingContributorService } from './auth-default-setting-contributor.service';

describe('AuthDefaultSettingContributorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AuthDefaultSettingContributorService = TestBed.get(AuthDefaultSettingContributorService);
    expect(service).toBeTruthy();
  });
});
