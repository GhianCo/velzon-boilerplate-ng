import { Component, OnInit } from '@angular/core';

import * as Prism from 'prismjs';
import {BreadcrumbsComponent} from "@shared/breadcrumbs/breadcrumbs.component";
@Component({
  selector: 'app-highlight',
  templateUrl: './highlight.component.html',
  styleUrls: ['./highlight.component.scss'],
  imports: [
    BreadcrumbsComponent
  ],
  standalone: true
})

/**
 * Highlight Component
 */
export class HighlightComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  constructor() { }

  ngOnInit(): void {
    /**
    * BreadCrumb
    */
     this.breadCrumbItems = [
      { label: 'Advance UI' },
      { label: 'Highlight', active: true }
    ];
  }

  ngAfterViewInit() {
    Prism.highlightAll();
  }

}
