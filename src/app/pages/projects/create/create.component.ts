import {Component, OnInit} from '@angular/core';

// Ck Editer
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {SimplebarAngularModule} from "simplebar-angular";
import {BreadcrumbsComponent} from "@shared/breadcrumbs/breadcrumbs.component";
import {CKEditorModule} from "@ckeditor/ckeditor5-angular";
import {FlatpickrModule} from "angularx-flatpickr";
import {DropzoneModule} from "ngx-dropzone-wrapper";
import {NgSelectComponent} from "@ng-select/ng-select";

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
  imports: [
    SimplebarAngularModule,
    BreadcrumbsComponent,
    CKEditorModule,
    FlatpickrModule,
    DropzoneModule,
    NgSelectComponent,
  ],
  standalone: true
})

/**
 * Create Component
 */
export class CreateComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  public Editor = ClassicEditor;

  constructor() {
  }

  ngOnInit(): void {
    /**
     * BreadCrumb
     */
    this.breadCrumbItems = [
      {label: 'Projects'},
      {label: 'Create Project', active: true}
    ];
  }

  /**
   * Multiple Default Select2
   */
  selectValue = ['Choice 1', 'Choice 2', 'Choice 3'];

}
