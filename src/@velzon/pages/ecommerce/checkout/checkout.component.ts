import { Component, OnInit } from '@angular/core';
import {NgbModal, NgbNav, NgbNavContent, NgbNavItem, NgbNavLink, NgbNavOutlet} from '@ng-bootstrap/ng-bootstrap';

// Sweet Alert
import Swal from 'sweetalert2';
import {BreadcrumbsComponent} from "../../../components/breadcrumbs/breadcrumbs.component";

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
  imports: [
    BreadcrumbsComponent,
    NgbNav,
    NgbNavItem,
    NgbNavLink,
    NgbNavContent,
    NgbNavOutlet
  ],
  standalone: true
})

/**
 * Checkout Component
 */
export class CheckoutComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  submitted = false;

  constructor(private modalService: NgbModal) { }

  ngOnInit(): void {
    /**
    * BreadCrumb
    */
     this.breadCrumbItems = [
      { label: 'Ecommerce' },
      { label: 'Checkout', active: true }
    ];
  }

  /**
   * Confirmation mail model
   */
  confirm(content:any) {
    this.modalService.open(content, { centered: true });
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
