import { Component, OnInit } from '@angular/core';
import { getValueLabelList } from 'src/app/helpers/list.helpers.js';
import { CheckboxItem } from '../checkbox-group/checkbox-group.component.js';
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
    mobility_types: [],
    funding: []
  };

  public config = config;
  public continents = getValueLabelList(config.continents);
  public countries;
  public noContinent = false;
  public mobilityTypesOptions = [
    new CheckboxItem('Student', 'Student'),
    new CheckboxItem('Staff', 'Staff'),
  ];
  public fundingOptions = [
    new CheckboxItem('Erasmus', 'Erasmus'),
    new CheckboxItem('Belgica', 'Belgica'),
    new CheckboxItem('Frame-Mercator', 'Frame-Mercator')
  ];
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

  validate(event: any): void {
    console.log(this.model);
  }

  onMobilityTypesChange(value) {
    this.model.mobility_types = value;
  }

  onFundingChange(value) {
    this.model.funding = value;
  }
}
