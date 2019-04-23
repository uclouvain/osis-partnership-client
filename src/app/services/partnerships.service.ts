import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { tap, map, find, filter } from 'rxjs/operators';
import * as queryString from 'query-string';

import { environment } from '../../environments/environment';
import Partnership, { ResultPartnerships } from '../interfaces/partnership';
import Partner, { ResultPartners } from '../interfaces/partners';

const httpOptions = {
  headers: new HttpHeaders({
    Authorization: `Token ${environment.api.token}`
  })
};

export interface PartnershipParams {
  campus: string;
  city: string;
  continent: string;
  country: string;
  education_field: string;
  limit: number;
  offset: number;
  partner: string;
  supervisor: string;
  type: string;
  ucl_university: string;
  ucl_university_labo: string;
}

export interface PartnerParams {
  campus: string;
  city: string;
  continent: string;
  country: string;
  education_field: string;
  limit: number;
  offset: number;
  supervisor: string;
  type: string;
  ucl_university: string;
  ucl_university_labo: string;
}

@Injectable({
  providedIn: 'root'
})
export class PartnershipsService {
  private cachePartnerships: BehaviorSubject<Partnership[]> = new BehaviorSubject([]);
  private cachePartners: BehaviorSubject<Partner[]> = new BehaviorSubject([]);
  private cachePartners$: Observable<ResultPartners>;

  constructor(
    private http: HttpClient
  ) {
  }

  /**
   * Returns partnerships results and keep results in cache
   */
  public searchPartnerships(query?: PartnershipParams): Observable<ResultPartnerships> {
    return this.requestPartnerships(query).pipe(
      tap(partnerships => {
        this.cachePartnerships.next(partnerships.results);
      })
    );
  }

  /**
   * Returns a single partnership, from cache if any
   * or fetched
   */
  public getPartnership(id: string) {
    if (this.cachePartners$) {
      return this.cachePartnerships.pipe(
        map(partnerships => partnerships.find(partnership => {
          const partnershipId = partnership.url.split('/').reverse()[1];
          return partnershipId === id;
        }))
      );
    }

    return this.requestPartnership(id);
  }

  public searchPartners(query: PartnerParams): Observable<ResultPartners> {
    if (!this.cachePartners$) {
      this.cachePartners$ = this.requestPartners(query).pipe(
        tap((partners) => {
          this.cachePartners.next(partners.results);
        })
      );
    }
    return this.cachePartners$;
  }

  /**
   * Returns a single partner, from cache if any
   * or fetched
   */
  public getPartner(id: string) {
    return this.cachePartners.pipe(
      map(partners => partners.find(partner => partner.uuid === id))
    );
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
