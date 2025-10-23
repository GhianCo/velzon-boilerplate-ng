import { Component, OnInit } from '@angular/core';
import {BreadcrumbsComponent} from "../../../components/breadcrumbs/breadcrumbs.component";
import {DropzoneModule} from "ngx-dropzone-wrapper";

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
  imports: [
    BreadcrumbsComponent,
    DropzoneModule
  ],
  standalone: true
})

/**
 * Create Component
 */
export class CreateComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  constructor() { }

  ngOnInit(): void {
    /**
    * BreadCrumb
    */
     this.breadCrumbItems = [
      { label: 'NFT Marketplace' },
      { label: 'Create NFT', active: true }
    ];
  }

}
