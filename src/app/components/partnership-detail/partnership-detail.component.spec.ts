import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {PartnershipDetailComponent} from './partnership-detail.component';
import {SharedModule} from 'src/app/shared.module';

describe('PartnershipDetailComponent', () => {
  let component: PartnershipDetailComponent;
  let fixture: ComponentFixture<PartnershipDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule]
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
