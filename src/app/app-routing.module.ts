import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchComponent } from './components/search/search.component';
import { ModalPartnerComponent } from './components/modal-partner/modal-partner.component';
import { PartnershipListComponent } from './components/partnership-list/partnership-list.component';
import { PartnershipDetailComponent } from './components/partnership-detail/partnership-detail.component';

const routes: Routes = [
  { path: '', component: SearchComponent, children: [
    { path: 'partner/:id', component: ModalPartnerComponent, children: [
      { path: '', pathMatch: 'full', component: PartnershipListComponent },
      { path: 'partnership/:id', component: PartnershipDetailComponent },
    ]}
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
