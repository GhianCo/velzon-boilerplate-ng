import { Component, OnInit } from '@angular/core';

import {
  NgbAccordionBody, NgbAccordionButton,
  NgbAccordionCollapse,
  NgbAccordionDirective,
  NgbAccordionHeader,
  NgbAccordionItem,
  NgbDropdown,
  NgbModal
} from '@ng-bootstrap/ng-bootstrap';
import {BreadcrumbsComponent} from "@shared/breadcrumbs/breadcrumbs.component";
import {NgTemplateOutlet} from "@angular/common";
import {FlatpickrModule} from "angularx-flatpickr";

@Component({
  selector: 'app-deals',
  templateUrl: './deals.component.html',
  styleUrls: ['./deals.component.scss'],
  imports: [
    BreadcrumbsComponent,
    NgbDropdown,
    NgbAccordionDirective,
    NgbAccordionItem,
    NgbAccordionHeader,
    NgTemplateOutlet,
    NgbAccordionCollapse,
    NgbAccordionBody,
    FlatpickrModule,
    NgbAccordionButton
  ],
  standalone: true
})

/**
 * Deals Component
 */
export class DealsComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  submitted = false;

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
    /**
    * BreadCrumb
    */
     this.breadCrumbItems = [
      { label: 'CRM' },
      { label: 'Deals', active: true }
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
