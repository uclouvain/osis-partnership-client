import {TestBed, waitForAsync} from '@angular/core/testing';
import {TranslateService} from '@ngx-translate/core';

import {AppComponent} from './app.component';
import {SharedModule} from './shared.module';

describe('AppComponent', () => {
  let translate: TranslateService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AppComponent ],
      imports: [
        SharedModule
      ]
    }).compileComponents();
    translate = TestBed.get(TranslateService);
  }));

  afterEach(() => {
    translate = undefined;
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  // it(`should have as title 'osis-partnership-client'`, () => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   const app = fixture.debugElement.componentInstance;
  //   expect(app.title).toEqual('osis-partnership-client');
  // });

  // it('should render title in a h1 tag', () => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   fixture.detectChanges();
  //   const compiled = fixture.debugElement.nativeElement;
  //   expect(compiled.querySelector('h1').textContent).toContain('Welcome to osis-partnership-client!');
  // });
});
