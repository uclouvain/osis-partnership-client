import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TranslateService } from '@ngx-translate/core';

import { SearchComponent } from './components/search/search.component';
import { CheckboxGroupComponent } from './components/checkbox-group/checkbox-group.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorMessageComponent } from './components/error-message/error-message.component';
import { LoadingService, LoadingInterceptor } from './services/loading.service';
import { LoaderComponent } from './components/loader/loader.component';
import { PartnersListComponent } from './components/partners-list/partners-list.component';
import { PartnershipListComponent } from './components/partnership-list/partnership-list.component';
import { PartnershipDetailComponent } from './components/partnership-detail/partnership-detail.component';
import { ModalPartnerComponent } from './components/modal-partner/modal-partner.component';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
 imports: [
    HttpClientModule,
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
    AlertModule.forRoot(),
    ButtonsModule.forRoot(),
    TooltipModule.forRoot(),
    HttpClientModule,
    NgxDatatableModule,
    AppRoutingModule
  ],
  declarations: [
    SearchComponent,
    CheckboxGroupComponent,
    PartnersListComponent,
    PartnershipListComponent,
    PartnershipDetailComponent,
    ModalPartnerComponent,
    ErrorMessageComponent,
    LoaderComponent
  ],
  exports: [
    HttpClientModule,
    BrowserModule,
    FormsModule,
    TranslateModule,
    TypeaheadModule,
    ModalModule,
    AlertModule,
    ButtonsModule,
    TooltipModule,
    HttpClientModule,
    NgxDatatableModule,
    AppRoutingModule
  ],
  providers: [
    TranslateService,
    LoadingService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true
    }
  ]
})
export class SharedModule {
  constructor(translate: TranslateService) {
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('en');

    if (window.location.pathname.startsWith('/fr/')) {
      translate.use('fr');
    }

    if (window.location.pathname.startsWith('/en/')) {
      // the lang to use, if the lang isn't available, it will use the current loader to get them
      translate.use('en');
    }
  }
}
