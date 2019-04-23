import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnershipDetailComponent } from './partnership-detail.component';

describe('PartnershipDetailComponent', () => {
  let component: PartnershipDetailComponent;
  let fixture: ComponentFixture<PartnershipDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartnershipDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnershipDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
