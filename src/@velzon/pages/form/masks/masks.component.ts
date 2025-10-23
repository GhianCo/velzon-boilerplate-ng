import { Component, OnInit } from '@angular/core';
import {BreadcrumbsComponent} from "../../../components/breadcrumbs/breadcrumbs.component";
import {NgxMaskDirective} from "ngx-mask";

@Component({
  selector: 'app-masks',
  templateUrl: './masks.component.html',
  styleUrls: ['./masks.component.scss'],
  imports: [
    BreadcrumbsComponent,
    NgxMaskDirective
  ],
  standalone: true
})

/**
 * Masks Component
 */
export class MasksComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  constructor() { }

  ngOnInit(): void {
    /**
    * BreadCrumb
    */
     this.breadCrumbItems = [
      { label: 'Forms' },
      { label: 'Input Masks', active: true }
    ];
  }

}
