import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentmoduleproxyComponent } from './componentmoduleproxy.component';

describe('ComponentmoduleproxyComponent', () => {
  let component: ComponentmoduleproxyComponent;
  let fixture: ComponentFixture<ComponentmoduleproxyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComponentmoduleproxyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentmoduleproxyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
