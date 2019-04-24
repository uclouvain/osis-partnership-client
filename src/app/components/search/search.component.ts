import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { map, delay } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';

import { CheckboxItem } from '../checkbox-group/checkbox-group.component.js';
import { ValueLabel } from 'src/app/interfaces/common';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { LoadingService } from 'src/app/services/loading.service.js';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, OnDestroy {
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
    mobility_types: ['Student'],
    funding: [],
    limit: 25,
    offset: 0
  };

  // Fields from configuration
  public continents$: Observable<ValueLabel[]>;
  public countries$: Observable<ValueLabel[]>;
  public educationFields$: Observable<ValueLabel[]>;
  public partners$: Observable<ValueLabel[]>;
  public supervisors$: Observable<ValueLabel[]>;
  public uclUniversities$: Observable<ValueLabel[]>;
  public uclUniversitiesLabo$: Observable<ValueLabel[]>;

  public continentLabel = '';
  public noContinent = false;
  public mobilityTypesOptions = [
    new CheckboxItem('student', 'Student'),
    new CheckboxItem('staff', 'Staff'),
  ];
  public fundingOptions = [
    new CheckboxItem('Erasmus', 'Erasmus'),
    new CheckboxItem('Belgica', 'Belgica'),
    new CheckboxItem('Fame-Mercator', 'Fame-Mercator')
  ];

  public loaderStatus: boolean;
  private loaderStatus$: Subscription;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private configurationService: ConfigurationService,
    private loading: LoadingService
  ) {
    // add delay to prevent expression has changed after it was checked
    this.loaderStatus$ = this.loading.status.pipe(delay(0)).subscribe(status => (this.loaderStatus = status));
  }

  ngOnDestroy(): void {
    this.loaderStatus$.unsubscribe();
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
            : this.model.mobility_types,
          funding: params.funding
            ? typeof params.funding === 'string' ? [params.funding] : [...params.funding]
            : this.model.funding
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

  onCountryChanged(event: any): void {
    if (event.item) {
      this.model.country = event.item.id;
      this.continentLabel = event.value;
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
    // Reset current page to 1
    this.model.offset = 0;
    this.router.navigate(['/'], { queryParams: this.model });
  }

  searchPartnerships(event: any)  {
    event.preventDefault();
    this.model.type = 'partnerships';
    // Reset current page to 1
    this.model.offset = 0;
    this.router.navigate(['/'], { queryParams: this.model });
  }

  onMobilityTypesChange(value) {
    console.log(value);
    this.model.mobility_types = value;
  }

  onFundingChange(value) {
    this.model.funding = value;
  }
}
