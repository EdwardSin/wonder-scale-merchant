import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StoreListControllerComponent } from './store-list-controller.component';

describe('StoreListControllerComponent', () => {
  let component: StoreListControllerComponent;
  let fixture: ComponentFixture<StoreListControllerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StoreListControllerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreListControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
