import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PartnershipsService} from 'src/app/services/partnerships.service';
import Partnership, {ResultPartnerships} from 'src/app/interfaces/partnership';
import {getMobilityType, getPartnershipParams} from 'src/app/helpers/partnerships.helpers';
import {Type} from '../../interfaces/partnership_type';

@Component({
  selector: 'app-partnership-list',
  templateUrl: './partnership-list.component.html',
  styleUrls: ['./partnership-list.component.css']
})
export class PartnershipListComponent implements OnInit {
  @ViewChild('partnershipSummaryCell')
  partnershipSummaryCell: TemplateRef<any>;

  public rows: any[];
  public page = {
    totalElements: 0,
    totalPages: 0,
    pageNumber: 0,
    size: 25
  };
  public loadingIndicator = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private partnershipsService: PartnershipsService
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe((queryParams: any): any => {
      this.fetchPartnerships(queryParams);
    });
  }

  fetchPartnerships({ partnerFilter, ...queryParams}): void {
    this.partnershipsService.searchPartnerships(getPartnershipParams({ ...queryParams, partner: partnerFilter}))
      .subscribe((response: ResultPartnerships) => {
        if (response && response.results) {
          if (response.results.length === 1) {
            // Go to partnership detail if only one result
            const partnership = response.results[0];
            const partnershipId = partnership.uuid;
            this.router.navigate([`${partnership.partner.uuid}/partnership/${partnershipId}`], {
              queryParamsHandling: 'merge',
              queryParams: {
                uniquePartnership: true,
              }
            });
          } else {
            // Go to partnership list if more than one result
            this.page.totalElements = response.count;
            this.page.totalPages = Math.ceil(this.page.totalElements / +this.page.size);
            this.page.pageNumber = Math.floor((+queryParams.offset || 0) / +this.page.size);
            this.rows = response.results.map((partnership: Partnership) => ({
              ...partnership,
              mobility_type: partnership && getMobilityType(partnership),
              cellTemplate: this.partnershipSummaryCell
            }));
          }
        }
      });
  }

  getDetailLink(value: Partnership) {
    return [`/${value.partner.uuid}/partnership/${value.uuid}`];
  }

  /**
   * Populate the table with new data based on the page number
   */
  setPage(pageInfo) {
    this.page.pageNumber = +pageInfo.offset;
    const offset = +pageInfo.offset * this.page.size;
    this.router.navigate(['.'], {
      relativeTo: this.route,
      queryParamsHandling: 'merge',
      queryParams: {
        offsetPartnership: offset
      },
    });
  }

  isMobility(partnership) {
    return partnership.partnership_type === Type.Mobility;
  }

  isProject(partnership) {
    return partnership.partnership_type === Type.Project;
  }
}
