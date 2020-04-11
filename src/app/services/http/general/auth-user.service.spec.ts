import { TestBed, inject } from '@angular/core/testing';

import { AuthUserService } from './auth-user.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AuthUserService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthUserService],
      schemas: [NO_ERRORS_SCHEMA]
    });
  });

  it('should be created', inject([AuthUserService], (service: AuthUserService) => {
    expect(service).toBeTruthy();
  }));
});
