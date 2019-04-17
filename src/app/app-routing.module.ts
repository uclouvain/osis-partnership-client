import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchComponent } from './components/search/search.component';
import { DetailPartnershipComponent } from './components/detail-partnership/detail-partnership.component';
import { ListPartnershipsComponent } from './components/list-partnerships/list-partnerships.component';

const routes: Routes = [
  { path: '', component: SearchComponent, children: [
    { path: 'partnership/:id', component: DetailPartnershipComponent },
    { path: 'partners/:id', component: ListPartnershipsComponent }
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
