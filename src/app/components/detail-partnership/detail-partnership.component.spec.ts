import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailPartnershipComponent } from './detail-partnership.component';

describe('DetailPartnershipComponent', () => {
  let component: DetailPartnershipComponent;
  let fixture: ComponentFixture<DetailPartnershipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailPartnershipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailPartnershipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
