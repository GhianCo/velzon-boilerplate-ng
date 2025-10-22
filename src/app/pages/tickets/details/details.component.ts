import { Component, OnInit } from '@angular/core';
import {SimplebarAngularModule} from "simplebar-angular";
import {NgbTooltip} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  imports: [
    SimplebarAngularModule,
    NgbTooltip
  ],
  standalone: true
})

/**
 * Details Component
 */
export class DetailsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
