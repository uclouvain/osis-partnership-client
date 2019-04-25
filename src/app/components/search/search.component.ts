import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { map, delay } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';

import { CheckboxItem } from '../checkbox-group/checkbox-group.component.js';
import { ValueLabel } from 'src/app/interfaces/common';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { LoadingService } from 'src/app/services/loading.service.js';
import { getValueLabelList } from 'src/app/helpers/list.helpers.js';
import { Configuration } from 'src/app/interfaces/configuration.js';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, OnDestroy {
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
    mobility_types: ['Student'],
    funding: [],
    limit: 25,
    offset: 0
  };

  public config: Configuration;
  public continents: ValueLabel[];
  public countries: ValueLabel[];
  public educationFields: ValueLabel[];
  public partners: ValueLabel[];
  public supervisors: ValueLabel[];
  public uclUniversities: ValueLabel[];
  public uclUniversitiesLabo: ValueLabel[];

  public continentLabel = '';
  public noContinent = false;
  public mobilityTypesOptions = [
    new CheckboxItem('Student', 'Student'),
    new CheckboxItem('Staff', 'Staff'),
  ];
  public fundingOptions: CheckboxItem[] = [];

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

    // Fetch configuration data from server
    this.configurationService.all().subscribe(config => {
      this.config = config;
      // Fundings options
      config.fundings.map(funding => {
        this.fundingOptions.push(new CheckboxItem(funding, funding));
      });
      this.continents = getValueLabelList(config.continents);
      this.educationFields = config.education_fields;
      this.partners = config.partners;
      this.supervisors = config.supervisors;
      this.uclUniversities = config.ucl_universities;
    });
  }

  ngOnDestroy(): void {
    this.loaderStatus$.unsubscribe();
  }

  ngOnInit() {
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
      this.countries = getValueLabelList(this.config.continents, { name: 'countries', value: event.value });
      console.log(this.countries)
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
      this.uclUniversitiesLabo = getValueLabelList(this.config.ucl_universities, { name: 'ucl_university_labos', value: event.value });
    }
  }

  searchPartners(event: any): void {
    event.preventDefault();
    // Reset current page to 1
    this.model.offset = 0;
    this.router.navigate(['/'], { queryParams: this.model });
  }

  onMobilityTypesChange(value) {
    this.model.mobility_types = value;
  }

  onFundingChange(value) {
    this.model.funding = value;
  }
}
