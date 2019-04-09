import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import * as partners from '../../__mocks__/partners.json';
@Component({
  selector: 'app-list-partners',
  templateUrl: './list-partners.component.html',
  styleUrls: ['./list-partners.component.css']
})
export class ListPartnersComponent implements OnInit {
  @ViewChild('partnershipSummaryCell')
  partnershipSummaryCell: TemplateRef<any>;

  public rows = partners.results;
  public columns = [
    { name: 'Name' },
    { name: 'Country' },
    { name: 'City' },
    { prop: 'partnerships', summaryFunc: () => null, summaryTemplate: this.partnershipSummaryCell },
  ];
  loadingIndicator = true;
  reorderable = true;

  constructor() { }

  ngOnInit() {
  }
}
