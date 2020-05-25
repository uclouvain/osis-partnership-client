import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import * as queryString from 'query-string';

import { environment } from '../../environments/environment';
import Partnership, { PartnershipParams, ResultPartnerships } from '../interfaces/partnership';
import Partner, { PartnerParams, ResultPartners } from '../interfaces/partners';
import { CacheService } from './cache.service';

@Injectable({
  providedIn: 'root'
})
export class PartnershipsService {
  private cachePartnerships: BehaviorSubject<Partnership[]> = new BehaviorSubject([]);
  private cachePartners: BehaviorSubject<Partner[]> = new BehaviorSubject([]);

  constructor(
    private cache: CacheService
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
  public getPartnership(partnerId: string, id: string): Observable<Partnership> {
    let partnerships$: Observable<Partnership[]>;

    if (this.cachePartnerships.getValue().find(partnership => {
      return partnership.uuid === id;
    }) !== undefined) {
      partnerships$ = this.cachePartnerships;
    } else {
      partnerships$ = this.searchPartnerships({partner: partnerId}).pipe(
        map(results => results.results)
      );
    }

    return partnerships$.pipe(
        map(partnerships => partnerships.find(partnership => {
          return partnership.uuid === id;
        }),
      )
    );
  }

  public searchPartners(query: PartnerParams): Observable<ResultPartners> {
    return this.requestPartners(query).pipe(
      tap((partners) => {
        this.cachePartners.next(partners.results);
      })
    );
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

  private requestPartnerships(query: PartnershipParams) {
    return this.cache.get<ResultPartnerships>(`${environment.api.url}partnerships/?${queryString.stringify(query)}`);
  }

  private requestPartnership(id: string) {
    return this.cache.get<Partnership>(`${environment.api.url}partnerships/${id}`);
  }

  private requestPartners(query: PartnerParams) {
    return this.cache.get<ResultPartners>(`${environment.api.url}partners?${queryString.stringify(query)}`);
  }
}
