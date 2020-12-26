import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WsSearchSelectComponent } from './ws-search-select.component';

describe('WsSearchSelectComponent', () => {
  let component: WsSearchSelectComponent;
  let fixture: ComponentFixture<WsSearchSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WsSearchSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WsSearchSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
