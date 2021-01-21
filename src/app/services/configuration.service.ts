import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { Configuration } from '../interfaces/configuration';

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

  private requestConfiguration() {
    return this.http.get<Configuration>(`${environment.api.url}configuration`);
  }
}
