import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ImportTablesModalComponent } from './import-tables-modal.component';

describe('ImportTablesModalComponent', () => {
  let component: ImportTablesModalComponent;
  let fixture: ComponentFixture<ImportTablesModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportTablesModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportTablesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
