import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { PartnershipsService } from '../../services/partnerships.service';
import { getPartnerParams } from '../../helpers/partnerships.helpers';
import { catchError } from 'rxjs/operators';
import Partner from '../../interfaces/partners';

@Component({
  selector: 'app-partner-results',
  templateUrl: './partner-results.component.html',
  styleUrls: ['./partner-results.component.css']
})
export class PartnerResultsComponent implements OnInit {
  public mapVisible = true;
  public results: Partner[];
  public loading = true;
  public partnersError = false;
  public totalPartners = 0;
  public totalPartnerships = 0;
  public visibleMarkers: Partner[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private partnershipsService: PartnershipsService
  ) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((queryParams: Params): any => {
      if (queryParams.ordering === undefined) {
        queryParams = { ...queryParams, ordering: 'country_en,city' };
        this.router.navigate(['partners'], {
          queryParamsHandling: 'merge',
          queryParams
        });
      }
      this.fetchPartners(queryParams);
    });
  }

  /**
   * Fetch partner's list with url filters params
   */
  fetchPartners(queryParams): void {
    this.loading = true;
    this.results = [];
    this.partnershipsService.searchPartners(getPartnerParams(queryParams))
      .pipe(
        catchError((): any => {
          this.partnersError = true;
          this.loading = false;
          document.getElementById('partners-list').scrollIntoView();
        })
      )
      .subscribe((results: Partner[]) => {
        this.partnersError = false;
        this.loading = false;
        if (results) {
          this.results = results;
          this.totalPartners = results.length;
          this.totalPartnerships = 0;
          this.visibleMarkers = results;
          results.map(partner => {
            this.totalPartnerships += partner.partnerships_count;
          });
        }
      });
  }

  switchVisibleComponent() {
    this.mapVisible = !this.mapVisible;
  }

  onVisibleMarkersUpdated(partners: Partner[]) {
    this.totalPartners = partners.length;
    this.totalPartnerships = 0;
    this.visibleMarkers = partners;
    partners.map(partner => {
      this.totalPartnerships += partner.partnerships_count;
    });
  }
}
