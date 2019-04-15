import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as queryString from 'query-string';

import { environment } from '../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    Authorization: 'Token 2f6d04a4aba73ff441c76d2fff3e8c78421e9ab1'
  })
};

@Injectable({
  providedIn: 'root'
})
export class PartnershipsService {
  constructor(
    private http: HttpClient
  ) {
  }

  partnerships(query: object) {
    return this.http.get(`${environment.api.url}partnerships/?${queryString.stringify(query)}`, httpOptions);
  }

  partners(query: object) {
    return this.http.get(`${environment.api.url}partners/?${queryString.stringify(query)}`, httpOptions);
  }
}
