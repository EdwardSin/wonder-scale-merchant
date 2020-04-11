import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UncategoriedItemsComponent } from './uncategoried-items.component';

describe('UncategoriedItemsComponent', () => {
  let component: UncategoriedItemsComponent;
  let fixture: ComponentFixture<UncategoriedItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UncategoriedItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UncategoriedItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
