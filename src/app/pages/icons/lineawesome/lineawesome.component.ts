import { Component, OnInit } from '@angular/core';
import { ToastService } from '../toast-service';
import {BreadcrumbsComponent} from "@shared/breadcrumbs/breadcrumbs.component";
import {ToastsContainerallicon} from "@app/pages/icons/toasts-container.component";

@Component({
  selector: 'app-lineawesome',
  templateUrl: './lineawesome.component.html',
  styleUrls: ['./lineawesome.component.scss'],
  imports: [
    BreadcrumbsComponent,
    ToastsContainerallicon
  ],
  standalone: true
})

/**
 * Lineawesome Icon Component
 */
export class LineawesomeComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  constructor(public toastService: ToastService) { }

  ngOnInit(): void {
    /**
    * BreadCrumb
    */
    this.breadCrumbItems = [
      { label: 'Icons' },
      { label: 'Line Awesome', active: true }
    ];
  }

  copytext(event: any) {
    var element = event.target.querySelector('i').className
    navigator.clipboard.writeText(element);
    this.toastService.show(element + ' icon Copied Successfully !!!', { classname: 'bg-success text-center text-white', delay: 5000 });
  }

}
