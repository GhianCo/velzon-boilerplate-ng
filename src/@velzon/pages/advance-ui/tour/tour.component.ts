import { Component, OnInit, ChangeDetectionStrategy, AfterViewInit } from '@angular/core';
import {BreadcrumbsComponent} from "../../../components/breadcrumbs/breadcrumbs.component";
@Component({
  selector: 'app-tour',
  templateUrl: './tour.component.html',
  styleUrls: ['./tour.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    BreadcrumbsComponent
  ],
  standalone: true
})

/**
 * Tour Component
 */
export class TourComponent implements OnInit, AfterViewInit {


  // bread crumb items
  breadCrumbItems!: Array<{}>;

  constructor() {}

  ngAfterViewInit(): void {

  }

  ngOnInit(): void {
    /**
    * BreadCrumb
    */
     this.breadCrumbItems = [
      { label: 'Advance UI' },
      { label: 'Tour', active: true }
    ];
  }

}
