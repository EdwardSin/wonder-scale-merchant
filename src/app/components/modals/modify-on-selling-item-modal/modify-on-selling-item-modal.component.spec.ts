import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyOnSellingItemModalComponent } from './modify-on-selling-item-modal.component';

describe('ModifyOnSellingItemModalComponent', () => {
  let component: ModifyOnSellingItemModalComponent;
  let fixture: ComponentFixture<ModifyOnSellingItemModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModifyOnSellingItemModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyOnSellingItemModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
