import { Component, OnInit } from '@angular/core';
import * as partners from '../../__mocks__/partners.json';
@Component({
  selector: 'app-list-partners',
  templateUrl: './list-partners.component.html',
  styleUrls: ['./list-partners.component.css']
})
export class ListPartnersComponent implements OnInit {
  public rows = partners;
  public columns = [
    { prop: 'name' },
    { name: 'Country' },
    { name: 'City' },
    { name: 'Partnerships' },
  ];
  loadingIndicator = true;
  reorderable = true;
  constructor() { }

  ngOnInit() {
  }

}
