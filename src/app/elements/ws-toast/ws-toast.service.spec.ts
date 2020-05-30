import { TestBed } from '@angular/core/testing';

import { WsToastService } from './ws-toast.service';

describe('WsToastService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WsToastService = TestBed.get(WsToastService);
    expect(service).toBeTruthy();
  });
});
