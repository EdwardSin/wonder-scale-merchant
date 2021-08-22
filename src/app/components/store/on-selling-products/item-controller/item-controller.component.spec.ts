import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ItemControllerComponent } from './item-controller.component';

describe('ItemControllerComponent', () => {
  let component: ItemControllerComponent;
  let fixture: ComponentFixture<ItemControllerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemControllerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
