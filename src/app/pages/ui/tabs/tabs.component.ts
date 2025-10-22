import { Component, OnInit } from '@angular/core';
import {BreadcrumbsComponent} from "@shared/breadcrumbs/breadcrumbs.component";
import {NgbNav, NgbNavContent, NgbNavItem, NgbNavLink, NgbNavOutlet} from "@ng-bootstrap/ng-bootstrap";
import {NgTemplateOutlet} from "@angular/common";

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  imports: [
    BreadcrumbsComponent,
    NgbNav,
    NgbNavItem,
    NgbNavLink,
    NgbNavContent,
    NgTemplateOutlet,
    NgbNavOutlet
  ],
  standalone: true
})

/**
 * Tabs Component
 */
export class TabsComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  constructor() { }

  ngOnInit(): void {
    /**
    * BreadCrumb
    */
     this.breadCrumbItems = [
      { label: 'Base UI' },
      { label: 'Tabs', active: true }
    ];
  }

}
