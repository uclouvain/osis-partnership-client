import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPartnersComponent } from './list-partners.component';
import { SharedModule } from 'src/app/shared.module';

describe('ListPartnersComponent', () => {
  let component: ListPartnersComponent;
  let fixture: ComponentFixture<ListPartnersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ SharedModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPartnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
