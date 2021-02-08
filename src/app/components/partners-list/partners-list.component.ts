import {
  Component,
  Input,
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
export class PartnersListComponent {
  @ViewChild(DatatableComponent)
  private datatableComponent: DatatableComponent;

  @ViewChild('partnershipSummaryCell')
  partnershipSummaryCell: TemplateRef<any>;

  @Input() rows: Partner[] = [];
  @Input() loading = true;
  @Input() totalPartnerships = 0;
  @Input() mapHash: string = null;
  public pageSize = 25;
  public sorts = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {
  }

  /**
   * See partner's partnerships list
   */
  goToPartnerships(e: any, value: Partner) {
    e.preventDefault();
    // If multiple partnerships, go to partnership list modal
    this.router.navigate(['', value], {
      queryParamsHandling: 'merge',
      queryParams: {
        partnerFilter: value,
        map: this.mapHash,
      }
    });
  }

  repaint() {
    setTimeout(() => this.datatableComponent.recalculate(), 50);
  }
}
