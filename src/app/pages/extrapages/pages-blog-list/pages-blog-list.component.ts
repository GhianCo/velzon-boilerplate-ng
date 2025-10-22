import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { blogList } from '@appCore/data/blogsList';
import { PaginationService } from '@appCore/services/pagination.service';
import { SharedModule } from '@app/shared/shared.module';
import {BreadcrumbsComponent} from "@shared/breadcrumbs/breadcrumbs.component";

@Component({
    selector: 'app-pages-blog-list',
  imports: [CommonModule, RouterModule, NgbPaginationModule, SharedModule, BreadcrumbsComponent],
    templateUrl: './pages-blog-list.component.html',
    styleUrl: './pages-blog-list.component.scss'
})
export class PagesBlogListComponent {
  // bread crumb items
  breadCrumbItems!: Array<{}>;
  listview: any
  alllistview: any;


  constructor(public service: PaginationService) {
    this.service.pageSize = 3
  }

  ngOnInit(): void {
    /**
* BreadCrumb
*/
    this.breadCrumbItems = [
      { label: 'Blogs' },
      { label: 'List View', active: true }
    ];

    // Fetch Data
    setTimeout(() => {
      this.listview = this.service.changePage(blogList);
      this.alllistview = blogList;
    }, 1200)
  }

  // Pagination
  changePage() {
    this.listview = this.service.changePage(this.alllistview)
  }


}
