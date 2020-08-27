import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ModifyCardComponent } from './modify-card.component';


describe('ModifyCardComponent', () => {
  let component: ModifyCardComponent;
  let fixture: ComponentFixture<ModifyCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ModifyCardComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
