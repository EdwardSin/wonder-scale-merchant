import { TestBed } from '@angular/core/testing';

import { WsMessagebarService } from './ws-message-bar.service';

describe('WsMessagebarService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WsMessagebarService = TestBed.get(WsMessagebarService);
    expect(service).toBeTruthy();
  });
});
