import { Component, OnInit } from '@angular/core';
import {ColorPickerModule} from "ngx-color-picker";
import {BreadcrumbsComponent} from "../../../components/breadcrumbs/breadcrumbs.component";
import {FlatpickrModule} from "angularx-flatpickr";
import {provideNgxMask} from "ngx-mask";

@Component({
  selector: 'app-pickers',
  templateUrl: './pickers.component.html',
  styleUrls: ['./pickers.component.scss'],
  imports: [
    ColorPickerModule,
    BreadcrumbsComponent,
    FlatpickrModule
  ],
  providers: [provideNgxMask()],
  standalone: true
})

/**
 * Pickers Component
 */
export class PickersComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  componentcolor!: string;
  monolith!: string;
  nano!: string;

  modelValueAsDate: Date = new Date();

  constructor() { }

  ngOnInit(): void {
    /**
    * BreadCrumb
    */
     this.breadCrumbItems = [
      { label: 'Forms' },
      { label: 'Pickers', active: true }
    ];
  }

  inlineDatePicker: Date = new Date();

}
