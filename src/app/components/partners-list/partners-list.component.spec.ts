import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnersListComponent } from './partners-list.component';
import { SharedModule } from 'src/app/shared.module';

describe('PartnersListComponent', () => {
  let component: PartnersListComponent;
  let fixture: ComponentFixture<PartnersListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ SharedModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
