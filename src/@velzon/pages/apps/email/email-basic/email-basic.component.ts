import { Component, OnInit } from '@angular/core';
import { FeatherModule } from 'angular-feather';
import {BreadcrumbsComponent} from "../../../../components/breadcrumbs/breadcrumbs.component";

@Component({
  selector: 'app-email-basic',
  templateUrl: './email-basic.component.html',
  styleUrls: ['./email-basic.component.scss'],
  imports: [
    FeatherModule,
    BreadcrumbsComponent
  ],
  standalone: true
})

/**
 * Email-Basic Component
 */
export class EmailBasicComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  constructor() { }

  ngOnInit(): void {
    /**
     * BreadCrumb
     */
     this.breadCrumbItems = [
      { label: 'Email' },
      { label: 'Basic Action', active: true }
    ];
  }

}
