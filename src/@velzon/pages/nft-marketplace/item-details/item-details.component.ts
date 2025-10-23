import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { map } from 'rxjs/operators';
import {BreadcrumbsComponent} from "../../../components/breadcrumbs/breadcrumbs.component";
import {
  NgbDropdown,
  NgbDropdownMenu,
  NgbDropdownToggle,
  NgbNav,
  NgbNavItem,
  NgbNavOutlet
} from "@ng-bootstrap/ng-bootstrap";
import {SimplebarAngularModule} from "simplebar-angular";

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.scss'],
  imports: [
    BreadcrumbsComponent,
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownMenu,
    NgbNav,
    NgbNavItem,
    SimplebarAngularModule,
    NgbNavOutlet
  ],
  standalone: true
})

/**
 * ItemDetails Component
 */
export class ItemDetailsComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  // set the current year
  year: number = new Date().getFullYear();
  private _trialEndsAt: any;
  private _diff?: any;
  _days?: number;
  _hours?: number;
  _minutes?: number;
  _seconds?: number;

  constructor() { }

  ngOnInit(): void {
    // Date Set
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 1); // Add 1 day to the current date
    this._trialEndsAt = currentDate.toISOString().split('T')[0]; // Format as 'YYYY-MM-DD'

    /**
     * Count date set
     */
    interval(1000).pipe(map((x) => {
      this._diff = Date.parse(this._trialEndsAt) - Date.parse(new Date().toString());
    })).subscribe((x) => {
      this._days = this.getDays(this._diff);
      this._hours = this.getHours(this._diff);
      this._minutes = this.getMinutes(this._diff);
      this._seconds = this.getSeconds(this._diff);
    });

    /**
    * BreadCrumb
    */
    this.breadCrumbItems = [
      { label: 'NFT Marketplace' },
      { label: 'Item Details', active: true }
    ];
  }

  /**
   * Day Set
   */
  getDays(t: number) {
    return Math.floor(t / (1000 * 60 * 60 * 24));
  }

  /**
   * Hours Set
   */
  getHours(t: number) {
    return Math.floor((t / (1000 * 60 * 60)) % 24);
  }

  /**
   * Minutes set
   */
  getMinutes(t: number) {
    return Math.floor((t / 1000 / 60) % 60);
  }

  /**
   * Secound set
   */
  getSeconds(t: number) {
    return Math.floor((t / 1000) % 60);
  }

}
