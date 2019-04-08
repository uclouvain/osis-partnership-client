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
    campus: '',
    supervisor: '',
    education_field: '',
    mobility_type: [],
    funding: []
  };

  public config = config;
  public continents = getValueLabelList(config.continents);
  public countries;
  public noContinent = false;

  constructor() {
  }

  ngOnInit() {
    console.log(this.config);
  }

  typeaheadNoContinent(event: boolean): void {
    this.noContinent = event;
  }

  onContinentChanged(event: any): void {
    if (event.value) {
      this.countries = getValueLabelList(config.continents, { name: 'countries', value: event.value });
    }
  }
}
