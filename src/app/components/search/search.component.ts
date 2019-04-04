import { Component, OnInit } from '@angular/core';
import { getValueLabelList } from 'src/app/helpers/list.helpers.js';

import * as config from '../../__mocks__/configuration.json';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  public model = {
    continent: '',
    country: '',
    city: '',
    partner: '',
    ucl_university: '',
    ucl_university_labo: '',
    supervisor: '',
    education_field: '',
    mobility_type: [],
    funding: []
  };

  public config = config;
  public continents = getValueLabelList(config.continents);
  public noContinent = false;

  constructor() { }

  ngOnInit() {
  }

  typeaheadNoContinent(event: boolean): void {
    this.noContinent = event;
  }
}
