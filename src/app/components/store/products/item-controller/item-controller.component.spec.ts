import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemControllerComponent } from './item-controller.component';

describe('ItemControllerComponent', () => {
  let component: ItemControllerComponent;
  let fixture: ComponentFixture<ItemControllerComponent>;

  beforeEach(async(() => {
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
