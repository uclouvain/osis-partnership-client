import { Component, OnInit, Input } from '@angular/core';
import Partnership from 'src/app/interfaces/partnership';
import { getMobilityType } from 'src/app/helpers/partnerships.helpers';

@Component({
  selector: 'app-detail-partnership',
  templateUrl: './detail-partnership.component.html',
  styleUrls: ['./detail-partnership.component.css']
})
export class DetailPartnershipComponent implements OnInit {

  @Input() data: Partnership;

  constructor() { }

  ngOnInit() {
  }

  get mobilityType() {
    return getMobilityType(this.data);
  }

}
