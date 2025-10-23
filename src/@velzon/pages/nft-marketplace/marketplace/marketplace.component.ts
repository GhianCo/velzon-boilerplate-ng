import { Component, OnInit } from '@angular/core';

import { marketplaceModel, tradingModel, recentModel, popularModel } from './marketplace.model';
import { marketplaceData, popularData, recentMarketData, tradingData } from '@velzon/core/data';
import {BreadcrumbsComponent} from "../../../components/breadcrumbs/breadcrumbs.component";
import {RouterLink} from "@angular/router";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-marketplace',
  templateUrl: './marketplace.component.html',
  styleUrls: ['./marketplace.component.scss'],
  imports: [
    BreadcrumbsComponent,
    RouterLink,
    NgClass
  ],
  standalone: true
})

/**
 * Marketplace Component
 */
export class MarketplaceComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  marketplaceData!: marketplaceModel[];
  tradingData!: tradingModel[];
  recentData!: recentModel[];
  popularData!: popularModel[];

  constructor() { }

  ngOnInit(): void {
     /**
    * BreadCrumb
    */
    this.breadCrumbItems = [
      { label: 'NFT Marketplace' },
      { label: 'Marketplace', active: true }
    ];

    /**
    * fetches data
    */
    this._fetchData();
  }

   /**
 * Trending All Categories
 */
  private _fetchData() {
    this.marketplaceData = marketplaceData;
    this.tradingData = tradingData;
    this.recentData = recentMarketData;
    this.popularData = popularData;
  }

  /**
   * Active Toggle navbar
   */
  activeMenu(id:any) {
    document.querySelector('.heart_icon_'+id)?.classList.toggle('active');
  }

}
