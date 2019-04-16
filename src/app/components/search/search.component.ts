import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { CheckboxItem } from '../checkbox-group/checkbox-group.component.js';
import { ValueLabel } from 'src/app/interfaces/common';
import { ConfigurationService } from 'src/app/services/configuration.service';

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
    funding: [],
    limit: 25,
    offset: 0
  };
  public partnershipId: number;

  // Fields from configuration
  public continents$: Observable<ValueLabel[]>;
  public countries$: Observable<ValueLabel[]>;
  public educationFields$: Observable<ValueLabel[]>;
  public partners$: Observable<ValueLabel[]>;
  public supervisors$: Observable<ValueLabel[]>;
  public uclUniversities$: Observable<ValueLabel[]>;
  public uclUniversitiesLabo$: Observable<ValueLabel[]>;

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
    private route: ActivatedRoute,
    private configurationService: ConfigurationService
  ) {
  }

  ngOnInit() {
    // Fetch configuration data from server
    this.continents$ = this.configurationService.continents;
    this.educationFields$ = this.configurationService.educationFields;
    this.partners$ = this.configurationService.partners;
    this.supervisors$ = this.configurationService.supervisors;
    this.uclUniversities$ = this.configurationService.uclUniversities;

    // Init form with url params
    this.route.queryParams
      .pipe(
        // mobility_types and funding need to be arrays
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
        if (params.continent) {
          this.onContinentChanged({ value: params.continent });
        }
        this.model = params;
      });
  }

  typeaheadNoContinent(event: boolean): void {
    this.noContinent = event;
  }

  onContinentChanged(event: any): void {
    if (event.value) {
      this.countries$ = this.configurationService.getCoutries(event.value);
    }
  }

  getUclUniversitiesLabo(event: any): void {
    if (event.value) {
      this.uclUniversitiesLabo$ = this.configurationService.getUclUniversitiesLabo(event.value);
    }
  }

  searchPartners(event: any): void {
    event.preventDefault();
    this.model.type = 'partners';
    this.router.navigate(['/'], { queryParams: this.model });
  }

  searchPartnerships(event: any)  {
    event.preventDefault();
    this.model.type = 'partnerships';
    this.router.navigate(['/'], { queryParams: this.model });
  }

  onFundingChange(value) {
    this.model.funding = value;
  }
}
