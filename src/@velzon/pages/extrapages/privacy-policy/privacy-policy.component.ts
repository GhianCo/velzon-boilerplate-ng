import { Component, OnInit } from '@angular/core';
import {BreadcrumbsComponent} from "../../../components/breadcrumbs/breadcrumbs.component";

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss'],
  imports: [
    BreadcrumbsComponent
  ],
  standalone: true
})
export class PrivacyPolicyComponent implements OnInit {


  // bread crumb items
  breadCrumbItems!: Array<{}>;

  constructor() { }

  ngOnInit(): void {
    /**
   * BreadCrumb
   */
    this.breadCrumbItems = [
      { label: 'Pages' },
      { label: 'Privacy Policy', active: true }
    ];
  }

}
