import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerResultsComponent } from './partner-results.component';

describe('PartnerResultsComponent', () => {
  let component: PartnerResultsComponent;
  let fixture: ComponentFixture<PartnerResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartnerResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
