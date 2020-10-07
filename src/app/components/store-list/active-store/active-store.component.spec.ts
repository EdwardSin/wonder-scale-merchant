import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveStoreComponent } from './active-store.component';

describe('ActiveStoreComponent', () => {
  let component: ActiveStoreComponent;
  let fixture: ComponentFixture<ActiveStoreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActiveStoreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
