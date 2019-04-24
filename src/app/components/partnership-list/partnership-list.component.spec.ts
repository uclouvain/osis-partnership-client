import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnershipListComponent } from './partnership-list.component';
import { SharedModule } from 'src/app/shared.module';

describe('PartnershipListComponent', () => {
  let component: PartnershipListComponent;
  let fixture: ComponentFixture<PartnershipListComponent>;

  beforeEach(async(() => {
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
