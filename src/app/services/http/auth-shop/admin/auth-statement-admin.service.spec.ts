import { TestBed } from '@angular/core/testing';

import { AuthStatementAdminService } from './auth-statement-admin.service';

describe('AuthStatementAdminService', () => {
  let service: AuthStatementAdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthStatementAdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
