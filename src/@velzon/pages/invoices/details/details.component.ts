import { Component, OnInit } from '@angular/core';
import {BreadcrumbsComponent} from "../../../components/breadcrumbs/breadcrumbs.component";

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss'],
  imports: [
    BreadcrumbsComponent
  ],
  standalone: true
})

/**
 * Details Component
 */
export class DetailsComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  constructor() { }

  ngOnInit(): void {
    /**
    * BreadCrumb
    */
     this.breadCrumbItems = [
      { label: 'Invoices' },
      { label: 'Create Invoice', active: true }
    ];
  }

}
