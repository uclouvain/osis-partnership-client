import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TranslateService } from '@ngx-translate/core';

import { SearchComponent } from './components/search/search.component';
import { CheckboxGroupComponent } from './components/checkbox-group/checkbox-group.component';
import { ListPartnersComponent } from './components/list-partners/list-partners.component';
import { ListPartnershipsComponent } from './components/list-partnerships/list-partnerships.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { DetailPartnershipComponent } from './components/detail-partnership/detail-partnership.component';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
 imports: [
    BrowserModule,
    FormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    TypeaheadModule.forRoot(),
    TabsModule.forRoot(),
    ModalModule.forRoot(),
    HttpClientModule,
    NgxDatatableModule,
    AppRoutingModule
  ],
  declarations: [
    SearchComponent,
    CheckboxGroupComponent,
    ListPartnersComponent,
    ListPartnershipsComponent,
    DetailPartnershipComponent
  ],
  exports: [
    BrowserModule,
    FormsModule,
    TranslateModule,
    TypeaheadModule,
    ModalModule,
    HttpClientModule,
    NgxDatatableModule,
    AppRoutingModule
  ],
  providers: [TranslateService]
})
export class SharedModule {
  constructor(translate: TranslateService) {
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('en');

     // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use('en');
  }
}
