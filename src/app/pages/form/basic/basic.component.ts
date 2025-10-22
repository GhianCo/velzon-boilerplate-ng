import { Component, OnInit } from '@angular/core';
import {BreadcrumbsComponent} from "@shared/breadcrumbs/breadcrumbs.component";
import {NgbDropdown, NgbDropdownMenu, NgbDropdownToggle} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-basic',
  templateUrl: './basic.component.html',
  styleUrls: ['./basic.component.scss'],
  imports: [
    BreadcrumbsComponent,
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownMenu
  ],
  standalone: true
})

/**
 * Basic Forms Component
 */
export class BasicComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  constructor() { }

  ngOnInit(): void {
    /**
    * BreadCrumb
    */
     this.breadCrumbItems = [
      { label: 'Forms' },
      { label: 'Basic Elementss', active: true }
    ];
  }

  /**
   * Show Code Toggle
   */
   ShowCode(event: any) {
    let card = event.target.closest('.card');
    const preview = card.children[1].children[1];
    const codeView = card.children[1].children[2];
    if(codeView != null){
      codeView.classList.toggle('d-none');
    }
    if(preview != null){
      preview.classList.toggle('d-none');

    }
  }

}
