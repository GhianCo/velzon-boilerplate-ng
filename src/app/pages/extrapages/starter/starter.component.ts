import { Component, OnInit } from '@angular/core';
import {BreadcrumbsComponent} from "@shared/breadcrumbs/breadcrumbs.component";

@Component({
  selector: 'app-starter',
  templateUrl: './starter.component.html',
  styleUrls: ['./starter.component.scss'],
  imports: [
    BreadcrumbsComponent
  ],
  standalone: true
})

/**
 * Starter Component
 */
export class StarterComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  constructor() { }

  ngOnInit(): void {
    /**
    * BreadCrumb
    */
     this.breadCrumbItems = [
      { label: 'Pages' },
      { label: 'Starter', active: true }
    ];
  }

}
