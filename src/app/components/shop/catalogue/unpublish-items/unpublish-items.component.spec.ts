import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnpublishItemsComponent } from './unpublish-items.component';

describe('UnpublishItemsComponent', () => {
  let component: UnpublishItemsComponent;
  let fixture: ComponentFixture<UnpublishItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnpublishItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnpublishItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
