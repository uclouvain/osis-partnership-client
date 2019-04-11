import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SharedModule } from './shared.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    SharedModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
