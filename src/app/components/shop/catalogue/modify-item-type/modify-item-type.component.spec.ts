import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyItemTypeComponent } from './modify-item-type.component';

describe('ModifyItemTypeComponent', () => {
  let component: ModifyItemTypeComponent;
  let fixture: ComponentFixture<ModifyItemTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModifyItemTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyItemTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
