import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import * as partners from '../../__mocks__/partners.json';
import Partner from 'src/app/interfaces/partners.js';
@Component({
  selector: 'app-list-partners',
  templateUrl: './list-partners.component.html',
  styleUrls: ['./list-partners.component.css']
})
export class ListPartnersComponent implements OnInit {
  @ViewChild('partnershipSummaryCell')
  partnershipSummaryCell: TemplateRef<any>;

  public rows: Partner[] = partners.results.map(partner => ({
    ...partner,
    cellTemplate: this.partnershipSummaryCell
  }));

  loadingIndicator = true;
  reorderable = true;

  constructor() { }

  ngOnInit() {
  }
}
