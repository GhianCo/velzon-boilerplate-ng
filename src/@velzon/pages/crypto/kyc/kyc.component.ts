import { Component, OnInit } from '@angular/core';
import {NgbModal, NgbNav, NgbNavContent, NgbNavItem, NgbNavLink, NgbNavOutlet} from '@ng-bootstrap/ng-bootstrap';
import {BreadcrumbsComponent} from "../../../components/breadcrumbs/breadcrumbs.component";
import {FlatpickrModule} from "angularx-flatpickr";
import {DropzoneModule} from "ngx-dropzone-wrapper";

@Component({
  selector: 'app-kyc',
  templateUrl: './kyc.component.html',
  styleUrls: ['./kyc.component.scss'],
  imports: [
    BreadcrumbsComponent,
    NgbNav,
    NgbNavItem,
    NgbNavContent,
    NgbNavLink,
    FlatpickrModule,
    DropzoneModule,
    NgbNavOutlet
  ],
  standalone: true
})

/**
* Kyc Component
*/
export class KycComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  submitted = false;

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
    /**
    * BreadCrumb
    */
     this.breadCrumbItems = [
      { label: 'Crypto' },
      { label: 'KYC Application', active: true }
    ];
  }

  /**
   * Open modal
   * @param content modal content
   */
   openModal(content: any) {
    this.submitted = false;
    this.modalService.open(content, { size: 'lg', centered: true });
  }

}
