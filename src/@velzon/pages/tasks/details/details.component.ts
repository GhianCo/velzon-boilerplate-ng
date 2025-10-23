import { Component, OnInit } from '@angular/core';
import {
  NgbDropdown,
  NgbDropdownMenu,
  NgbDropdownToggle,
  NgbModal, NgbNav, NgbNavContent,
  NgbNavItem, NgbNavLink,
  NgbNavOutlet
} from '@ng-bootstrap/ng-bootstrap';
import {BreadcrumbsComponent} from "../../../components/breadcrumbs/breadcrumbs.component";
import {RouterLink} from "@angular/router";
import {SimplebarAngularModule} from "simplebar-angular";

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  imports: [
    BreadcrumbsComponent,
    RouterLink,
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownMenu,
    SimplebarAngularModule,
    NgbNavOutlet,
    NgbNavItem,
    NgbNavLink,
    NgbNavContent,
    NgbNav
  ],
  standalone: true
})

/**
 * Details Component
 */
export class DetailsComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  submitted = false;

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
    /**
    * BreadCrumb
    */
     this.breadCrumbItems = [
      { label: 'Tasks' },
      { label: 'Task Details', active: true }
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
