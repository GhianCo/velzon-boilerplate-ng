import { Component, QueryList, ViewChildren } from '@angular/core';
import {DecimalPipe} from '@angular/common';
import {Observable} from 'rxjs';

import { collectionModel } from './collection.model';
import { PaginationService } from '../../../services/pagination.service';
import { collectionData } from '@velzon/core/data';
import {BreadcrumbsComponent} from "../../../components/breadcrumbs/breadcrumbs.component";
import {FormsModule} from "@angular/forms";
import {NgbPagination} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.scss'],
  imports: [
    BreadcrumbsComponent,
    FormsModule,
    NgbPagination
  ],
  standalone: true
})

/**
 * Collections Component
 */
export class CollectionsComponent {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  collectionData: collectionModel[];
  searchTerm: any;
  searchResults: any;
  allcollectionData: any[];


  constructor(public service: PaginationService) {
    this.collectionData = collectionData;
    this.allcollectionData = collectionData;
  }

  ngOnInit(): void {
     /**
    * BreadCrumb
    */
      this.breadCrumbItems = [
        { label: 'NFT Marketplace' },
        { label: 'Collections', active: true }
      ];
  }

    // Pagination
    changePage() {
      this.collectionData = this.service.changePage(this.allcollectionData)
    }

    // Search Data
    performSearch(): void {
      this.searchResults = collectionData.filter((item: any) => {
        return (
          item.title.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
      });
      this.collectionData = this.service.changePage(this.searchResults)
    }

}
