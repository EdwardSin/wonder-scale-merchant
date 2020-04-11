import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WsItemComponent } from './ws-item.component';

describe('WsItemComponent', () => {
  let component: WsItemComponent;
  let fixture: ComponentFixture<WsItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WsItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WsItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
