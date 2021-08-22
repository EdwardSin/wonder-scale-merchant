import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ActiveStoreComponent } from './active-store.component';

describe('ActiveStoreComponent', () => {
  let component: ActiveStoreComponent;
  let fixture: ComponentFixture<ActiveStoreComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ActiveStoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
