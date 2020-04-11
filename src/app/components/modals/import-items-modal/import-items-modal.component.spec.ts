import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportItemsModalComponent } from './import-items-modal.component';

describe('ImportItemsModalComponent', () => {
  let component: ImportItemsModalComponent;
  let fixture: ComponentFixture<ImportItemsModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportItemsModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportItemsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
