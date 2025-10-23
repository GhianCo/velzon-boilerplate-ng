import { Component, OnInit } from '@angular/core';
import {NgbProgressbar} from "@ng-bootstrap/ng-bootstrap";
import {BreadcrumbsComponent} from "../../../components/breadcrumbs/breadcrumbs.component";

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss'],
  imports: [
    NgbProgressbar,
    BreadcrumbsComponent
  ],
  standalone: true
})

/**
 * Progress Component
 */
export class ProgressComponent implements OnInit {

   // bread crumb items
   breadCrumbItems!: Array<{}>;

   constructor() { }

   ngOnInit(): void {
     /**
     * BreadCrumb
     */
      this.breadCrumbItems = [
       { label: 'Base UI' },
       { label: 'Progress', active: true }
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
