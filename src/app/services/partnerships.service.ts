import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as queryString from 'query-string';

import { environment } from '../../environments/environment';

const httpOptions = {
  headers: new HttpHeaders({
    Authorization: `Token ${environment.api.token}`
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
    console.log('httpOptions', httpOptions);
    return this.http.get(`${environment.api.url}partnerships/`, httpOptions);
  }

  partners(query: object) {
    return this.http.get(`${environment.api.url}partners/?${queryString.stringify(query)}`, httpOptions);
  }
}
