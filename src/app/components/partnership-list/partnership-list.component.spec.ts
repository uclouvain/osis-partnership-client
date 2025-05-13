import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {PartnershipListComponent} from './partnership-list.component';
import {SharedModule} from 'src/app/shared.module';

describe('PartnershipListComponent', () => {
  let component: PartnershipListComponent;
  let fixture: ComponentFixture<PartnershipListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnershipListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
