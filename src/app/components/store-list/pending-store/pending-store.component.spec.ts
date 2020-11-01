import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingStoreComponent } from './pending-store.component';

describe('PendingStoreComponent', () => {
  let component: PendingStoreComponent;
  let fixture: ComponentFixture<PendingStoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingStoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
