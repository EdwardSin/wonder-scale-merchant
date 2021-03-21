import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportSalesModalComponent } from './export-sales-modal.component';

describe('ExportSalesModalComponent', () => {
  let component: ExportSalesModalComponent;
  let fixture: ComponentFixture<ExportSalesModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportSalesModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportSalesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
