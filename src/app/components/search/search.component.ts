import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { map, delay } from 'rxjs/operators';
import { Observable, Subscription } from 'rxjs';

import { CheckboxItem } from '../checkbox-group/checkbox-group.component.js';
import { ValueLabel } from 'src/app/interfaces/common';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { LoadingService } from 'src/app/services/loading.service.js';
import { getValueLabelList, getFormattedItemsList, getLabel } from 'src/app/helpers/list.helpers.js';
import { Configuration } from 'src/app/interfaces/configuration.js';
import { getCleanParams } from 'src/app/helpers/partnerships.helpers.js';

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
    mobility_type: ['student'],
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

  public countryInput = '';
  public uclUniversityInput = '';
  public uclUniversityLaboInput = '';
  public supervisorInput = '';
  public educationFieldInput = '';

  public noContinent = false;
  public mobilityTypesOptions = [
    new CheckboxItem('student', 'Student'),
    new CheckboxItem('staff', 'Staff'),
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
  }

  ngOnDestroy(): void {
    this.loaderStatus$.unsubscribe();
  }

  ngOnInit() {
    // Init form with url params
    this.route.queryParams
      .pipe(
        // mobility_type and funding need to be arrays
        map(params => ({
          ...this.model,
          ...params,
          mobility_type: params.mobility_type
            ? typeof params.mobility_type === 'string' ? [params.mobility_type] : [...params.mobility_type]
            : this.model.mobility_type,
          funding: params.funding
            ? typeof params.funding === 'string' ? [params.funding] : [...params.funding]
            : this.model.funding
          })
        )
      )
      .subscribe(params => {
        // Fetch configuration data from server
        this.configurationService.all().subscribe(config => {
          this.config = config;
          // Fundings options
          config.fundings.map(funding => {
            this.fundingOptions.push(new CheckboxItem(funding, funding));
          });
          // Typeahead list options
          this.continents = getValueLabelList(config.continents);
          this.educationFields = getFormattedItemsList(config.education_fields);
          this.partners = getFormattedItemsList(config.partners);
          this.supervisors = getFormattedItemsList(config.supervisors);
          this.uclUniversities = getFormattedItemsList(config.ucl_universities);

          // Init default input values from url params
          if (params.continent) {
            this.onContinentChanged({ value: params.continent });
            if (params.country) {
              this.countryInput = getLabel(this.countries, params.country);
            }
          }


          if (params.ucl_university) {
            this.uclUniversityInput = getLabel(this.uclUniversities, params.ucl_university);
            this.onUclUniversityChanged({ value: this.uclUniversityInput });
            if (params.ucl_university_labo) {
              this.uclUniversityLaboInput = getLabel(this.uclUniversitiesLabo, params.ucl_university_labo);
            }
          }

          if (params.supervisor) {
            this.supervisorInput = getLabel(this.supervisors, params.supervisor);
          }

          if (params.education_field) {
            this.educationFieldInput = getLabel(this.educationFields, params.education_field);
          }
        });

        this.model = params;
      });
  }

  /**
   * Show a warning message if selected continent is not valid
   */
  typeaheadNoContinent(event: boolean): void {
    this.noContinent = event;
  }

  /**
   * Set country list for selected continent
   */
  onContinentChanged = (event: any): void => {
    if (event.value && this.config) {
      this.countries = getValueLabelList(this.config.continents, { name: 'countries', value: event.value });
    }
  }

  /**
   * Set country code in model for request
   */
  onCountryChanged = (event: any): void => {
    if (event.item) {
      this.model.country = event.item.id;
    }
  }

  /**
   * Set ucl_university uuid in model for request
   * Set uclUniversitiesLabo for this ucl_university
   */
  onUclUniversityChanged = (event: any): void => {
    if (event.value && this.config) {
      this.uclUniversitiesLabo = getValueLabelList(this.config.ucl_universities, { name: 'ucl_university_labos', value: event.value });
    }

    if (event.item) {
      this.model.ucl_university = event.item.id;
    }
  }

  /**
   * Set ucl_university_labo uuid in model for request
   */
  onUclUniversityLaboChanged = (event: any): void => {
    if (event.item) {
      this.model.ucl_university_labo = event.item.id;
    }
  }

  /**
   * Set supervisor uuid in model for request
   */
  onSupervisorChanged = (event: any): void => {
    if (event.item) {
      this.model.supervisor = event.item.id;
    }
  }

  /**
   * Set education_field uuid in model for request
   */
  onEducationFieldChanged = (event: any): void => {
    if (event.item) {
      this.model.education_field = event.item.id;
    }
  }

  searchPartners(event: any): void {
    event.preventDefault();
    // Reset current page to 1
    this.model.offset = 0;
    this.router.navigate(['/'], { queryParams: getCleanParams(this.model) });
  }

  onMobilityTypesChange(value) {
    this.model.mobility_type = value;
  }

  onFundingChange(value) {
    this.model.funding = value;
  }
}
