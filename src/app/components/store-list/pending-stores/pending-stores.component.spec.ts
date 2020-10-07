import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingStoresComponent } from './pending-stores.component';

describe('PendingStoresComponent', () => {
  let component: PendingStoresComponent;
  let fixture: ComponentFixture<PendingStoresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingStoresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingStoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
