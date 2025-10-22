import { Component } from '@angular/core';

import { creatorsModel } from './creators.model';
import { PaginationService } from '@appCore/services/pagination.service';
import { creatorsData, creatorsListData } from '@appCore/data';
import {BreadcrumbsComponent} from "@shared/breadcrumbs/breadcrumbs.component";
import {RouterLink} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {NgbDropdown, NgbDropdownMenu, NgbDropdownToggle, NgbPagination} from "@ng-bootstrap/ng-bootstrap";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-creators',
  templateUrl: './creators.component.html',
  styleUrls: ['./creators.component.scss'],
  imports: [
    BreadcrumbsComponent,
    RouterLink,
    FormsModule,
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownMenu,
    NgClass,
    NgbPagination
  ],
  standalone: true
})

/**
 * Creators Component
 */
export class CreatorsComponent {
  // bread crumb items
  breadCrumbItems!: Array<{}>;
  creatorsData!: creatorsModel[];
  searchResults!: any[];
  searchTerm: any;
  creatorsListData!: any[];
  allcreatorsListData!: any[];

  constructor(public service: PaginationService) {
    this.service.pageSize = 10;
  }

  ngOnInit(): void {
    /**
    * BreadCrumb
    */
     this.breadCrumbItems = [
      { label: 'NFT Marketplace' },
      { label: 'Creators', active: true }
    ];

    // FetchData
    this.creatorsData = creatorsData;
    this.creatorsListData = creatorsListData;
    this.allcreatorsListData = creatorsListData;
  }

   // Pagination
   changePage() {
    this.creatorsListData = this.service.changePage(this.allcreatorsListData)
  }

  // Search Data
  performSearch(): void {
    this.searchResults = creatorsListData.filter((item: any) => {
      return (
        item.title.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    });
    this.creatorsListData = this.service.changePage(this.searchResults)
  }

}
