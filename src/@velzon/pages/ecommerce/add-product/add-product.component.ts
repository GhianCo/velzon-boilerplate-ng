import { Component, OnInit } from '@angular/core';

// Ck Editer
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {BreadcrumbsComponent} from "../../../components/breadcrumbs/breadcrumbs.component";
import {CKEditorModule} from "@ckeditor/ckeditor5-angular";
import {DropzoneModule} from "ngx-dropzone-wrapper";
import {NgbNav, NgbNavItem, NgbNavOutlet} from "@ng-bootstrap/ng-bootstrap";
import {FlatpickrModule} from "angularx-flatpickr";
import {NgSelectComponent} from "@ng-select/ng-select";

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
  imports: [
    BreadcrumbsComponent,
    CKEditorModule,
    DropzoneModule,
    NgbNav,
    NgbNavItem,
    NgbNavOutlet,
    FlatpickrModule,
    NgSelectComponent
  ],
  standalone: true
})

/**
 * AddProduct Component
 */
export class AddProductComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  public Editor = ClassicEditor;

  constructor() { }

  ngOnInit(): void {
    /**
    * BreadCrumb
    */
    this.breadCrumbItems = [
      { label: 'Ecommerce' },
      { label: 'Create Product', active: true }
    ];
  }

  /**
  * Multiple Default Select2
  */
  selectValue = ['Choice 1', 'Choice 2', 'Choice 3'];

  // File Upload
  imageURL: string | undefined;
  fileChange(event: any) {
    let fileList: any = (event.target as HTMLInputElement);
    let file: File = fileList.files[0];
    document.getElementById('')

    const reader = new FileReader();
    reader.onload = () => {
      this.imageURL = reader.result as string;
      (document.getElementById('product-img') as HTMLImageElement).src = this.imageURL;
    }
    reader.readAsDataURL(file)
  }

}
