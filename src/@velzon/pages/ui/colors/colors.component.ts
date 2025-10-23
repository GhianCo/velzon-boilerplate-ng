import {Component, OnInit} from '@angular/core';
import {BreadcrumbsComponent} from "../../../components/breadcrumbs/breadcrumbs.component";

@Component({
  selector: 'app-colors',
  templateUrl: './colors.component.html',
  styleUrls: ['./colors.component.scss'],
  standalone: true,
  imports: [
    BreadcrumbsComponent
  ]
})

/**
 * Colors Component
 */
export class ColorsComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  constructor() {
  }

  ngOnInit(): void {
    /**
     * BreadCrumb
     */
    this.breadCrumbItems = [
      {label: 'Base UI'},
      {label: 'Colors', active: true}
    ];
  }

}
