import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModifyItemComponent } from './modify-item.component';

describe('ModifyItemComponent', () => {
  let component: ModifyItemComponent;
  let fixture: ComponentFixture<ModifyItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModifyItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
