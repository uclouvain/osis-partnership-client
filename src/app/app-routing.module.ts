import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchComponent } from './components/search/search.component';
import { ModalPartnershipComponent } from './components/modal-partnership/modal-partnership.component';
import { ModalListPartnershipsComponent } from './components/modal-list-partnerships/modal-list-partnerships.component';

const routes: Routes = [
  { path: '', component: SearchComponent, children: [
    { path: 'partnership/:id', component: ModalPartnershipComponent },
    { path: 'partner/:id', component: ModalListPartnershipsComponent }
  ] },
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes, { useHash: true })
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
