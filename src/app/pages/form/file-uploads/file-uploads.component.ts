import { Component, OnInit } from '@angular/core';
import {BreadcrumbsComponent} from "@shared/breadcrumbs/breadcrumbs.component";
import {DropzoneModule} from "ngx-dropzone-wrapper";

@Component({
  selector: 'app-file-uploads',
  templateUrl: './file-uploads.component.html',
  styleUrls: ['./file-uploads.component.scss'],
  imports: [
    BreadcrumbsComponent,
    DropzoneModule
  ],
  standalone: true
})

/**
 * FileUploads Component
 */
export class FileUploadsComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  constructor() { }

  ngOnInit(): void {
    /**
    * BreadCrumb
    */
     this.breadCrumbItems = [
      { label: 'Forms' },
      { label: 'File Upload', active: true }
    ];
  }

}
