import {Component, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {NgbAccordionModule, NgbDropdownModule, NgbNavModule} from "@ng-bootstrap/ng-bootstrap";
import {SlickCarouselModule} from "ngx-slick-carousel";
import {CountUpModule} from "ngx-countup";
import {BreadcrumbsComponent} from "@shared/breadcrumbs/breadcrumbs.component";

@Component({
  selector: 'app-email-ecommerce',
  templateUrl: './email-ecommerce.component.html',
  styleUrls: ['./email-ecommerce.component.scss'],
  imports: [
    CommonModule,
    NgbNavModule,
    NgbAccordionModule,
    NgbDropdownModule,
    SlickCarouselModule,
    CountUpModule,
    BreadcrumbsComponent
  ],
  standalone: true
})

/**
 * Email Ecommerce Component
 */
export class EmailEcommerceComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  constructor() {
  }

  ngOnInit(): void {
    /**
     * BreadCrumb
     */
    this.breadCrumbItems = [
      {label: 'Email'},
      {label: 'Ecommerce Action', active: true}
    ];
  }

  // Click Scroll Top
  inView(ele: any) {
    ele.scrollIntoView({behavior: "smooth", block: "start", inline: "start"})
  }

}
