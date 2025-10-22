import { Component } from '@angular/core';
import {BreadcrumbsComponent} from "@shared/breadcrumbs/breadcrumbs.component";

@Component({
  selector: 'app-pages-blog-grid',
  templateUrl: './pages-blog-grid.component.html',
  imports: [
    BreadcrumbsComponent
  ],
  styleUrl: './pages-blog-grid.component.scss'
})
export class PagesBlogGridComponent {
  // bread crumb items
  breadCrumbItems!: Array<{}>;



  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Blogs' },
      { label: 'List View', active: true }
    ];
  }

}
