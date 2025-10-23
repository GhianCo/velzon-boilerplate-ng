import { Component } from '@angular/core';
import {
  NgbAccordionDirective, NgbAccordionItem,
  NgbDropdown,
  NgbModal,
  NgbNav,
  NgbNavContent,
  NgbNavItem,
  NgbNavLink,
  NgbNavOutlet, NgbPagination, NgbTooltip
} from '@ng-bootstrap/ng-bootstrap';

import { TokenStorageService } from '../../../../services/token-storage.service';

import { projectListModel, documentModel } from './profile.model';
import { document, projectList } from '@velzon/core/data';
import { PaginationService } from '../../../../services/pagination.service';
import {DatePipe} from "@angular/common";
import {SlickCarouselModule} from "ngx-slick-carousel";
import {RouterLink} from "@angular/router";
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  imports: [
    NgbNavOutlet,
    NgbNav,
    NgbNavItem,
    NgbNavLink,
    NgbNavContent,
    DatePipe,
    NgbDropdown,
    NgbAccordionDirective,
    NgbAccordionItem,
    SlickCarouselModule,
    NgbTooltip,
    NgbPagination,
    RouterLink
  ],
  standalone: true
})

/**
 * Profile Component
 */
export class ProfileComponent {

  projectList!: projectListModel[];
  document!: documentModel[];
  userData: any;
  allprojectList: any;

  constructor( private modalService: NgbModal,private TokenStorageService : TokenStorageService, public service: PaginationService) {

   }

  ngOnInit(): void {
    this.userData =  this.TokenStorageService.getUser();
    /**
     * Fetches the data
     */
     this.fetchData();
  }

  /**
   * Fetches the data
   */
   private fetchData() {
    this.document = document;
    this.projectList = projectList;
    this.allprojectList = projectList;
  }

  /**
   * Swiper setting
   */
  config = {
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    arrows: false
  };

 // Pagination
 changePage() {
  this.projectList = this.service.changePage(this.allprojectList)
}

/**
 * Confirmation mail model
 */
deleteId: any;
confirm(content: any, id: any) {
  this.deleteId = id;
  this.modalService.open(content, { centered: true });
}

// Delete Data
deleteData(id: any) {
  this.document.slice(id, 1)
  this.modalService.dismissAll()
}

}
