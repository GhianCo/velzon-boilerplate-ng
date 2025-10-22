import {Component, QueryList, ViewChildren} from '@angular/core';
import {DecimalPipe} from '@angular/common';
import {Observable} from 'rxjs';
import {NgbModal, NgbNav, NgbNavContent, NgbNavItem, NgbNavLink, NgbNavOutlet} from '@ng-bootstrap/ng-bootstrap';

import { projectDocument, ProjectTeam } from '@appCore/data';
import {SimplebarAngularModule} from "simplebar-angular";

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  imports: [
    NgbNav,
    NgbNavItem,
    NgbNavLink,
    NgbNavContent,
    SimplebarAngularModule,
    NgbNavOutlet
  ],
  standalone: true
})

/**
 * Overview Component
 */
export class OverviewComponent {

  projectListWidgets!: any;
  teamOverviewList: any;
  submitted = false;

  constructor(private modalService: NgbModal) {
  }

  ngOnInit(): void {
    /**
     * Fetches the data
     */
    this.projectListWidgets = projectDocument;
    this.teamOverviewList = ProjectTeam;
  }

    /**
   * Open modal
   * @param content modal content
   */
     openModal(content: any) {
      this.submitted = false;
      this.modalService.open(content, { size: 'md', centered: true });
    }

   /**
   * Active Toggle navbar
   */
  activeMenu(id:any) {
    document.querySelector('.star_'+id)?.classList.toggle('active');
  }


}
