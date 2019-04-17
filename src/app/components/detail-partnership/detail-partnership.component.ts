import { Component, OnInit, Input } from '@angular/core';
import Partnership from 'src/app/interfaces/partnership';

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

}
