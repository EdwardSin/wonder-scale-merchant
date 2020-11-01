import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreListControllerComponent } from './store-list-controller.component';

describe('StoreListControllerComponent', () => {
  let component: StoreListControllerComponent;
  let fixture: ComponentFixture<StoreListControllerComponent>;

  beforeEach(async(() => {
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
