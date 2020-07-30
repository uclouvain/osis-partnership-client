import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerResultsComponent } from './partner-results.component';
import { SharedModule } from 'src/app/shared.module';

describe('PartnerResultsComponent', () => {
  let component: PartnerResultsComponent;
  let fixture: ComponentFixture<PartnerResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ SharedModule ]
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
