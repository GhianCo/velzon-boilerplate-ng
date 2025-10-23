import { Component, OnInit } from '@angular/core';
import {NgbRating} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-ratings',
  templateUrl: './ratings.component.html',
  styleUrls: ['./ratings.component.scss'],
  imports: [
    NgbRating
  ],
  standalone: true
})

/**
 * Ratings Component
 */
export class RatingsComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  readonly = false;
  defaultSelect = 3;
  currentRate = 2;
  customColor = 4;
  hoverSelect = 2;
  hovered = 0;
  clearRate = 2;

  constructor() { }

  ngOnInit(): void {
    /**
    * BreadCrumb
    */
     this.breadCrumbItems = [
      { label: 'Advance UI' },
      { label: 'Ratings', active: true }
    ];
  }

}
