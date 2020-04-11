import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingShopsComponent } from './pending-shops.component';

describe('PendingShopsComponent', () => {
  let component: PendingShopsComponent;
  let fixture: ComponentFixture<PendingShopsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingShopsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingShopsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
