import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveToCategoriesModalComponent } from './move-to-categories-modal.component';

describe('MoveToCategoriesModalComponent', () => {
  let component: MoveToCategoriesModalComponent;
  let fixture: ComponentFixture<MoveToCategoriesModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoveToCategoriesModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoveToCategoriesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
