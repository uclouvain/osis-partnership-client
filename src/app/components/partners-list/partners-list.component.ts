import {
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';

import Partner from 'src/app/interfaces/partners.js';

import { ActivatedRoute, Params, Router } from '@angular/router';
import { DatatableComponent } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-partners-list',
  templateUrl: './partners-list.component.html',
  styleUrls: ['./partners-list.component.css']
})
export class PartnersListComponent implements OnInit {
  @ViewChild(DatatableComponent)
  private datatableComponent: DatatableComponent;

  @ViewChild('partnershipSummaryCell')
  partnershipSummaryCell: TemplateRef<any>;

  @Input() rows: Partner[] = [];
  @Input() loading = true;
  @Input() totalPartnerships = 0;
  public pageSize = 25;
  public sorts = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.route.queryParams.subscribe((queryParams: Params): any => {
      if (queryParams.ordering !== undefined) {
        this.setSorts(queryParams.ordering);
      }
    });
  }

  private setSorts(ordering: string) {
    this.sorts = ordering.split(',').map((prop) => {
      let dir = 'asc';
      if (prop[0] === '-') {
        dir = 'desc';
        prop = prop.substr(1);
      }
      if (prop === 'partner') {
        prop = 'name';
      } else if (prop === 'country_en') {
        prop = 'country';
      }
      return { prop, dir };
    });
  }

  /**
   * See partner's partnerships list
   */
  goToPartnerships(e: any, value: Partner) {
    e.preventDefault();
    // If multiple partnerships, go to partnership list modal
    this.router.navigate(['partners', value], {
      queryParamsHandling: 'merge',
      queryParams: {
        partnerFilter: value
      }
    });
  }

  /**
   * Add ordering filter
   * Reset offset to 0 to redirect to page 1
   */
  onSort(event) {
    const order = event.newValue;
    let orderColumn = event.column.prop;
    if (orderColumn === 'name') {
      orderColumn = 'partner';
    }

    if (orderColumn === 'country') {
      orderColumn = 'country_en,city';
    }

    const ordering = (order === 'asc' ? '' : '-') + orderColumn;
    this.router.navigate(['partners'], {
      queryParamsHandling: 'merge',
      queryParams: {
        ordering,
      }
    });
  }

  repaint() {
    setTimeout(() => this.datatableComponent.recalculate(), 50);
  }
}
