import { Component, QueryList, ViewChildren } from '@angular/core';
import {DecimalPipe, NgClass} from '@angular/common';
import {Observable} from 'rxjs';
import {NgbModal, NgbPagination} from '@ng-bootstrap/ng-bootstrap';
import {UntypedFormBuilder, FormGroup, FormArray, Validators, FormsModule} from '@angular/forms';

import { rankingModel } from './ranking.model';
import { rankingData } from '@appCore/data';
import { PaginationService } from '@appCore/services/pagination.service';
import {BreadcrumbsComponent} from "@shared/breadcrumbs/breadcrumbs.component";

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss'],
  imports: [
    BreadcrumbsComponent,
    FormsModule,
    NgClass,
    NgbPagination,
  ],
  standalone: true
})

/**
 * Ranking Component
 */
export class RankingComponent {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  rankingData!: rankingModel[];
  searchResults: any;
  searchTerm: any;
  allrankingData!: any[];


  constructor(private modalService: NgbModal,public service: PaginationService, private formBuilder: UntypedFormBuilder) {

  }

  ngOnInit(): void {
     /**
    * BreadCrumb
    */
      this.breadCrumbItems = [
        { label: 'NFT Marketplace' },
        { label: 'Ranking', active: true }
    ];

     // FetchData
     this.allrankingData = rankingData
     this.rankingData = this.service.changePage(rankingData)
  }

 // Pagination
 changePage() {
  this.rankingData = this.service.changePage(rankingData)
}

// Sort Data
  onSort(column: any) {
  this.rankingData = this.service.onSort(column, this.rankingData)
}

// Search Data
performSearch(): void {
  this.searchResults = rankingData.filter((item: any) => {
    return (
      item.ranking.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      item.collection.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      item.volume_price.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      item.item.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      item.floor_price.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  });
  this.rankingData = this.service.changePage(this.searchResults)
}

}
