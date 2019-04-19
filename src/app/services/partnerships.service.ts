import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as queryString from 'query-string';

import { environment } from '../../environments/environment';
import { tap } from 'rxjs/operators';
import Partnership, { ResultPartnerships } from '../interfaces/partnership';
import { Observable, of } from 'rxjs';
import Partner, { ResultPartners } from '../interfaces/partners';

const httpOptions = {
  headers: new HttpHeaders({
    Authorization: `Token ${environment.api.token}`
  })
};

interface CachePartnerships { [x: string]: Partnership; }
interface CachePartners { [x: string]: Partner; }

@Injectable({
  providedIn: 'root'
})
export class PartnershipsService {
  private cachePartnerships: CachePartnerships = {};
  private cachePartners$: Observable<ResultPartners>;

  constructor(
    private http: HttpClient
  ) {
  }

  /**
   * Returns partnerships results and keep results in cache
   */
  public searchPartnerships(query?: object): Observable<ResultPartnerships> {
    return this.requestPartnerships(query).pipe(
      tap(partnerships => {
        partnerships.results.map(partnership => {
          const id = partnership.url.split('/').reverse()[1];
          this.cachePartnerships[id] = partnership;
        });
      })
    );
  }

  /**
   * Returns a single partnership, from cache if any
   * or fetched
   */
  public getPartnership(id: string) {
    if (this.cachePartnerships && this.cachePartnerships[id]) {
      return of(this.cachePartnerships[id]);
    }

    return this.requestPartnership(id);
  }

  public searchPartners(query: object): Observable<ResultPartners> {
    if (!this.cachePartners$) {
      this.cachePartners$ = this.requestPartners(query);
    }
    return this.cachePartners$;
  }

  private requestPartnerships(query: object) {
    return this.http.get<ResultPartnerships>(`${environment.api.url}partnerships/?${queryString.stringify(query)}`, httpOptions);
  }

  private requestPartnership(id: string) {
    return this.http.get<Partnership>(`${environment.api.url}partnerships/${id}/`, httpOptions);
  }

  private requestPartners(query: object) {
    return this.http.get<ResultPartners>(`${environment.api.url}partners/?${queryString.stringify(query)}`, httpOptions);
  }
}
