import { Component, QueryList, ViewChildren } from '@angular/core';
import {DecimalPipe, NgClass} from '@angular/common';
import {Observable} from 'rxjs';
import {NgbCollapse, NgbDropdown, NgbDropdownMenu, NgbDropdownToggle, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {UntypedFormBuilder, FormGroup, FormArray, Validators, FormsModule} from '@angular/forms';

import { exploreModel } from './explore.model';
import { PaginationService } from '@appCore/services/pagination.service';
import { exploreData } from '@appCore/data';
import {BreadcrumbsComponent} from "@shared/breadcrumbs/breadcrumbs.component";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.scss'],
  imports: [
    BreadcrumbsComponent,
    FormsModule,
    NgbCollapse,
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownMenu,
    RouterLink,
    NgClass
  ],
  standalone: true
})

/**
 * Explore Component
 */
export class ExploreComponent {

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  checkedList: any;
  masterSelected!: boolean;
  basicData!: exploreModel[];
  public isCollapsed = false;
  searchResults: any;
  searchTerm: any;
  category: any = '';
  type: any = '';
  sale_type: any = '';

  constructor(private modalService: NgbModal,public service: PaginationService, private formBuilder: UntypedFormBuilder) {
  }

  ngOnInit(): void {
    /**
    * BreadCrumb
    */
     this.breadCrumbItems = [
      { label: 'NFT Marketplace' },
      { label: 'Explore Now', active: true }
    ];

     // FetchData
     this.basicData = exploreData;
  }


  // Range Slider Data
  value = 0;
  highValue = 1000;
  options = {
    floor: 0,
    ceil: 2000
  };

  /**
   * Active Toggle navbar
   */
  activeMenu(id:any) {
    document.querySelector('.heart_icon_'+id)?.classList.toggle('active');
  }

  // Search Data
  performSearch(): void {
    this.searchResults = exploreData.filter((item: any) => {
      return (
        item.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.type.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    });
    this.basicData = this.service.changePage(this.searchResults)
  }

  categoryFilter() {
    if (this.category != '') {
      this.basicData = exploreData.filter((data: any) => data.category == this.category);
    } else {
      this.basicData = exploreData;
    }
  }

  typeFilter() {
    if (this.type != '') {
      this.basicData = exploreData.filter((data: any) => data.type == this.type);
    } else {
      this.basicData = exploreData;
    }
  }

  saleFilter() {
    if (this.sale_type != '') {
      this.basicData = exploreData.filter((data: any) => data.sale_type == this.sale_type);
    } else {
      this.basicData = exploreData;
    }
  }

}
