import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditMultipleItemsModalComponent } from './edit-multiple-items-modal.component';

describe('EditMultipleItemsModalComponent', () => {
  let component: EditMultipleItemsModalComponent;
  let fixture: ComponentFixture<EditMultipleItemsModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditMultipleItemsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMultipleItemsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
