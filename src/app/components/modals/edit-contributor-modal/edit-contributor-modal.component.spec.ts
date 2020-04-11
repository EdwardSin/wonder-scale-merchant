import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditContributorModalComponent } from './edit-contributor-modal.component';

describe('EditContributorModalComponent', () => {
  let component: EditContributorModalComponent;
  let fixture: ComponentFixture<EditContributorModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditContributorModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditContributorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
