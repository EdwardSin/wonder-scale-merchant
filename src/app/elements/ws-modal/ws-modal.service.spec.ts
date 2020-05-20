import { TestBed } from '@angular/core/testing';

import { WsModalService } from './ws-modal.service';

describe('WsModalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WsModalService = TestBed.get(WsModalService);
    expect(service).toBeTruthy();
  });
});
