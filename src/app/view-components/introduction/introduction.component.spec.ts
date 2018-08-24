import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Introduction } from './introduction.component';


describe('Intoduction.ComponentComponent', () => {
  let component: Introduction;
  let fixture: ComponentFixture<Introduction>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Introduction ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Introduction);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
