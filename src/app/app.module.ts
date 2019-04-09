import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';

import { AppComponent } from './app.component';
import { SearchComponent } from './components/search/search.component';
import { CheckboxGroupComponent } from './components/checkbox-group/checkbox-group.component';
import { ListPartnersComponent } from './components/list-partners/list-partners.component';
import { ListPartnershipsComponent } from './components/list-partnerships/list-partnerships.component';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    CheckboxGroupComponent,
    ListPartnersComponent,
    ListPartnershipsComponent
  ],
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
    ModalModule.forRoot(),
    HttpClientModule,
    NgxDatatableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
