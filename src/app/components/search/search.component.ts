import { Component, OnInit } from '@angular/core';
import { getValueLabelList } from 'src/app/helpers/list.helpers.js';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';

import { CheckboxItem } from '../checkbox-group/checkbox-group.component.js';
import * as config from '../../__mocks__/configuration.json';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  public model = {
    type: 'partner',
    continent: '',
    country: '',
    city: '',
    partner: '',
    ucl_university: '',
    ucl_university_labo: '',
    campus: '',
    supervisor: '',
    education_field: '',
    mobility_types: ['student'],
    funding: []
  };
  public partnershipId: number;

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
  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.route.queryParams
      .pipe(
        map(params => ({
          ...this.model,
          ...params,
          mobility_types: params.mobility_types
            ? typeof params.mobility_types === 'string' ? [params.mobility_types] : [...params.mobility_types]
            : [],
          funding: params.funding
            ? typeof params.funding === 'string' ? [params.funding] : [...params.funding]
            : []
          })
        )
      )
      .subscribe(params => {
        console.log(params);
        this.model = params;
      });
  }

  typeaheadNoContinent(event: boolean): void {
    this.noContinent = event;
  }

  onContinentChanged(event: any): void {
    if (event.value) {
      this.countries = getValueLabelList(config.continents, { name: 'countries', value: event.value });
    }
  }

  searchPartners(event: any): void {
    this.model.type = 'partners';
    this.router.navigate(['/'], { queryParams: this.model });
  }

  searchPartnerships(event: any): void {
    this.model.type = 'partnerships';
    this.router.navigate(['/'], { queryParams: this.model });
  }

  onMobilityTypesChange(value) {
    this.model.mobility_types = value;
  }

  onFundingChange(value) {
    this.model.funding = value;
  }
}
