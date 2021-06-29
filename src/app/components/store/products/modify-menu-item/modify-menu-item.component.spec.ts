import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyMenuItemComponent } from './modify-menu-item.component';

describe('ModifyMenuItemComponent', () => {
  let component: ModifyMenuItemComponent;
  let fixture: ComponentFixture<ModifyMenuItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModifyMenuItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyMenuItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
