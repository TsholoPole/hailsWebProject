import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntroductionPageContentComponent } from './introduction-page-content.component';

describe('IntroductionPageContentComponent', () => {
  let component: IntroductionPageContentComponent;
  let fixture: ComponentFixture<IntroductionPageContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntroductionPageContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntroductionPageContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
