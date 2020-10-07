import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageResultComponent } from './package-result.component';

describe('PackageResultComponent', () => {
  let component: PackageResultComponent;
  let fixture: ComponentFixture<PackageResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PackageResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
