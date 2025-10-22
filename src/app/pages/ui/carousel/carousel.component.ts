import { Component, OnInit } from '@angular/core';
import {NgbCarousel, NgbSlide} from "@ng-bootstrap/ng-bootstrap";
import {BreadcrumbsComponent} from "@shared/breadcrumbs/breadcrumbs.component";

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
  imports: [
    NgbCarousel,
    BreadcrumbsComponent,
    NgbSlide
  ],
  standalone: true
})

/**
 * Carousel Component
 */
export class CarouselComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  constructor() { }

  ngOnInit(): void {
    /**
    * BreadCrumb
    */
     this.breadCrumbItems = [
      { label: 'Base UI' },
      { label: 'Carousel', active: true }
    ];
  }
  showNavigationArrows: any;
  showNavigationIndicators: any;

}
