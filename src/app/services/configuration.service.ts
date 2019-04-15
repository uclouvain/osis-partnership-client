import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, shareReplay, map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { Configuration } from '../interfaces/configuration';
import { getValueLabelList, getFormattedItemsList } from '../helpers/list.helpers';

const httpOptions = {
  headers: new HttpHeaders({
    Authorization: `Token ${environment.api.token}`
  })
};

const CACHE_SIZE = 1;

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {
  private cache$: Observable<Configuration>;

  constructor(
    private http: HttpClient
  ) {
  }

  public all(): Observable<Configuration> {
    if (!this.cache$) {
      this.cache$ = this.requestConfiguration().pipe(
        shareReplay(CACHE_SIZE)
      );
    }
    return this.cache$;
  }

  get continents() {
    return this.all().pipe(
      map((config: Configuration) => getValueLabelList(config.continents))
    );
  }

  get educationFields() {
    return this.all().pipe(
      map((config: Configuration) => config.education_fields)
    );
  }

  get partners() {
    return this.all().pipe(
      map((config: Configuration) => config.partners)
    );
  }

  get supervisors() {
    return this.all().pipe(
      map((config: Configuration) => config.supervisors)
    );
  }

  get uclUniversities() {
    return this.all().pipe(
      map((config: Configuration) => getFormattedItemsList(config.ucl_universities))
    );
  }

  private requestConfiguration() {
    return this.http.get<Configuration>(`${environment.api.url}partnerships/configuration/`, httpOptions);
  }
}
