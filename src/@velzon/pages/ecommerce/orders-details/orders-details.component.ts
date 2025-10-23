import { Component, OnInit } from '@angular/core';
import {
  NgbAccordionButton,
  NgbAccordionDirective,
  NgbAccordionHeader,
  NgbAccordionItem,
  NgbModal
} from '@ng-bootstrap/ng-bootstrap';
import { param } from 'jquery';
import {BreadcrumbsComponent} from "../../../components/breadcrumbs/breadcrumbs.component";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-orders-details',
  templateUrl: './orders-details.component.html',
  styleUrls: ['./orders-details.component.scss'],
  imports: [
    BreadcrumbsComponent,
    RouterLink,
    NgbAccordionDirective,
    NgbAccordionItem,
    NgbAccordionHeader,
    NgbAccordionButton
  ],
  standalone: true
})

/**
 * OrdersDetails Component
 */
export class OrdersDetailsComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  submitted = false;

  constructor(private modalService: NgbModal) {

  }

  ngOnInit(): void {
    /**
    * BreadCrumb
    */
    this.breadCrumbItems = [
      { label: 'Ecommerce' },
      { label: 'Order Details', active: true }
    ];

  }

 /**
   * Open modal
   * @param content modal content
   */

  openModal(content: any) {
    this.submitted = false;
    this.modalService.open(content, { size: 'md', centered: true });
  }

}
