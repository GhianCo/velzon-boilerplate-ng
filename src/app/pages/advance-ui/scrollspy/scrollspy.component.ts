import { Component, OnInit } from '@angular/core';
import {BreadcrumbsComponent} from "@shared/breadcrumbs/breadcrumbs.component";
import {NgClass} from "@angular/common";
import {ScrollspyDirective} from "@shared/scrollspy.directive";
import {NgbDropdown, NgbDropdownMenu} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-scrollspy',
  templateUrl: './scrollspy.component.html',
  styleUrls: ['./scrollspy.component.scss'],
  imports: [
    BreadcrumbsComponent,
    NgClass,
    ScrollspyDirective,
    NgbDropdown,
    NgbDropdownMenu
  ],
  standalone: true
})

/**
 * Scrollspy Component
 */
export class ScrollspyComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;

  currentSection = 'fat';

  constructor() { }

  ngOnInit(): void {
    /**
    * BreadCrumb
    */
     this.breadCrumbItems = [
      { label: 'Advance UI' },
      { label: 'ScrollSpy', active: true }
    ];
  }

  onSectionChange(sectionId: string) {
    if(sectionId){
      this.currentSection = sectionId;
    }
  }

  scrollTo(section: string) {
    const parentDiv = document.getElementById('parentDiv');
    const targetElement = document.getElementById(section);

    if (parentDiv && targetElement) {
        // Get the target element's position relative to the parent
        const targetPosition = targetElement.offsetTop;
        const parentScrollTop = parentDiv.scrollTop; // Current scroll position of the parent
        const scrollToPosition = targetPosition - parentScrollTop;

        parentDiv.scrollTo({
            top: scrollToPosition + parentScrollTop, // Add current scroll position to target
            behavior: 'smooth' // Smooth scrolling effect
        });
    }
  }

  // scrollTo(section: any) {
  //   document.querySelector('#' + section)?.scrollIntoView();
  // }


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
