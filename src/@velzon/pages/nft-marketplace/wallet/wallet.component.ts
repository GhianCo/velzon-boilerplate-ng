import { Component, OnInit } from '@angular/core';

import {walletModel} from './wallet.model';
import { nftwalletData } from '@velzon/core/data';
import {BreadcrumbsComponent} from "../../../components/breadcrumbs/breadcrumbs.component";

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss'],
  imports: [
    BreadcrumbsComponent

  ],
  standalone: true
})

/**
 * Wallet Component
 */
export class WalletComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  walletData!: walletModel[];

  constructor() { }

  ngOnInit(): void {
     /**
    * BreadCrumb
    */
    this.breadCrumbItems = [
      { label: 'NFT Marketplace' },
      { label: 'Wallet Connect', active: true }
    ];

    /**
     * fetches data
     */
     this._fetchData();

  }

  /**
  * NFT Wallet data fetches
  */
  private _fetchData() {
    this.walletData = nftwalletData;
  }

}
