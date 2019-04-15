import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { AppComponent } from './app.component';
import { SharedModule } from './shared.module';
import { PartnershipsService } from './services/partnerships.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    HttpClientModule,
    SharedModule,
  ],
  providers: [
    PartnershipsService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
