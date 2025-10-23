import { Component, OnInit } from '@angular/core';
import {BreadcrumbsComponent} from "../../../components/breadcrumbs/breadcrumbs.component";
import {SimplebarAngularModule} from "simplebar-angular";

@Component({
  selector: 'app-scrollbar',
  templateUrl: './scrollbar.component.html',
  styleUrls: ['./scrollbar.component.scss'],
  imports: [
    BreadcrumbsComponent,
    SimplebarAngularModule
  ],
  standalone: true
})

/**
 * Scrollbar Component
 */
export class ScrollbarComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  constructor() { }

  ngOnInit(): void {
    /**
    * BreadCrumb
    */
     this.breadCrumbItems = [
      { label: 'Advance UI' },
      { label: 'Scrollbar', active: true }
    ];
  }

}
