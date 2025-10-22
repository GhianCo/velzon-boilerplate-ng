import {Component, QueryList, ViewChildren} from '@angular/core';
import {AsyncPipe, DecimalPipe} from '@angular/common';
import {Observable} from 'rxjs';
import {NgbHighlight, NgbModal, NgbPagination} from '@ng-bootstrap/ng-bootstrap';
import {UntypedFormBuilder, FormGroup, FormArray, Validators, FormsModule} from '@angular/forms';

import {GridJsModel} from './gridjs.model';
import { GridJsService } from './gridjs.service';
import { PaginationService } from '@appCore/services/pagination.service';
import {BreadcrumbsComponent} from "@shared/breadcrumbs/breadcrumbs.component";

@Component({
  selector: 'app-gridjs',
  templateUrl: './gridjs.component.html',
  styleUrls: ['./gridjs.component.scss'],
  providers: [GridJsService, DecimalPipe],
  imports: [
    BreadcrumbsComponent,
    FormsModule,
    AsyncPipe,
    NgbHighlight,
    NgbPagination
  ],
  standalone: true
})

/**
 * Gridjs Table Component
 */
export class GridjsComponent {

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  // Table data
  gridjsList$!: Observable<GridJsModel[]>;
  total$: Observable<number>;
  griddata: any;

  constructor(private modalService: NgbModal,public service: GridJsService, private sortService: PaginationService) {
    this.gridjsList$ = service.countries$;
    this.total$ = service.total$;
  }

  ngOnInit(): void {
    /**
    * BreadCrumb
    */
     this.breadCrumbItems = [
      { label: 'Tables' },
      { label: 'Grid Js', active: true }
    ];
  }

  // Sort Data
  onSort(column: any) {
    this.griddata= this.sortService.onSort(column, this.griddata)
  }

}
