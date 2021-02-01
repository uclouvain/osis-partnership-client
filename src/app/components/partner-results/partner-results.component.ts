import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { PartnershipsService } from '../../services/partnerships.service';
import { getPartnerParams } from '../../helpers/partnerships.helpers';
import { catchError } from 'rxjs/operators';
import Partner from '../../interfaces/partners';
import { MapComponent } from '../map/map.component';
import { PartnersListComponent } from '../partners-list/partners-list.component';
import {
  BBoxChangedEvent,
  VisibleMarkerChangedEvent
} from '../../interfaces/events';

@Component({
  selector: 'app-partner-results',
  templateUrl: './partner-results.component.html',
  styleUrls: ['./partner-results.component.css']
})
export class PartnerResultsComponent implements OnInit {
  @ViewChild('map', { static: true }) map: MapComponent;
  @ViewChild('table', { static: true }) table: PartnersListComponent;
  @Output() bboxChanged = new EventEmitter<BBoxChangedEvent>();
  @Input() forceUclEntity?: string;
  @Input() forcePartnershipType?: string;

  public mapVisible = true;
  public results: Partner[] = [];
  public loading = true;
  public partnersError = false;
  public totalPartners = 0;
  public totalPartnerships = 0;
  public visibleMarkers: Partner[] = [];
  public mapInfluence = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private partnershipsService: PartnershipsService
  ) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((queryParams: Params): any => {
      if (this.forceUclEntity) {
        queryParams = {
          ...queryParams,
          ucl_entity: this.forceUclEntity,
        };
      }
      if (this.forcePartnershipType) {
        queryParams = {
          ...queryParams,
          type: this.forcePartnershipType,
        };
      }
      if (queryParams.ordering === undefined) {
        queryParams = { ...queryParams, ordering: 'country_en,city' };
        this.router.navigate([''], {
          queryParamsHandling: 'merge',
          queryParams
        });
      }
      // Prevent refetching when displaying or closing modal while having results
      if (!((queryParams.partnerFilter || queryParams.closingModal) && this.results.length)) {
        this.fetchPartners(queryParams);
      }
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
          this.onVisibleMarkersUpdated({ markers: this.results });
        }
      });
  }

  toggleMapInfluence() {
    this.mapInfluence = !this.mapInfluence;
    this.updateCount();
  }

  onVisibleMarkersUpdated(event: VisibleMarkerChangedEvent) {
    this.visibleMarkers = event.markers;
    if (event.forceMapInfluence) {
      this.mapInfluence = true;
    }
    this.updateCount();
  }

  onBBoxChanged(event: BBoxChangedEvent) {
    // Bubble up
    this.bboxChanged.emit(event);
  }

  private updateCount() {
    const partners = this.mapInfluence ? this.visibleMarkers : this.results;
    this.totalPartners = partners.length;
    this.totalPartnerships = 0;
    partners.map(partner => {
      this.totalPartnerships += partner.partnerships_count;
    });
  }

  switchToMapLayout() {
    this.mapVisible = true;
    this.map.repaint();
  }

  switchToListLayout() {
    this.mapVisible = false;
    this.table.repaint();
  }
}
