import { Component, OnInit } from '@angular/core';
import {ProcessComponent} from "../../components/landing/job/process/process.component";
import {JobcategoriesComponent} from "../../components/landing/job/jobcategories/jobcategories.component";
import {FindjobsComponent} from "../../components/landing/job/findjobs/findjobs.component";
import {CandidatesComponent} from "../../components/landing/job/candidates/candidates.component";
import {BlogComponent} from "../../components/landing/job/blog/blog.component";
import {JobFooterComponent} from "../../components/landing/job/job-footer/job-footer.component";
import {NgbCollapse} from "@ng-bootstrap/ng-bootstrap";
import {ScrollspyDirective} from "../../directives/scrollspy.directive";
import {NgClass} from "@angular/common";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.scss'],
  imports: [
    ProcessComponent,
    JobcategoriesComponent,
    FindjobsComponent,
    CandidatesComponent,
    BlogComponent,
    JobFooterComponent,
    NgbCollapse,
    ScrollspyDirective,
    NgClass,
    RouterLink
  ],
  standalone: true
})
export class JobComponent implements OnInit {

  currentSection:string = 'hero';
  public isCollapsed = true;

  constructor() { }

  ngOnInit(): void {
  }

  /**
* Section changed method
* @param sectionId specify the current sectionID
*/
  onSectionChange(sectionId: string) {
    this.currentSection = '';
    this.currentSection = sectionId;
  }

  scrollTo(section: string, offset: number = 0) {
    const element = document.getElementById(section);
    if (element) {
      const topPos = element.getBoundingClientRect().top + window.pageYOffset + offset;
      window.scrollTo({
        top: topPos,
        behavior: 'smooth'
      });
    }

    this.onSectionChange(section);
  }


  /**
    * Window scroll method
    */
  // tslint:disable-next-line: typedef
  windowScroll() {
    const navbar = document.getElementById('navbar');
    if (document.body.scrollTop > 40 || document.documentElement.scrollTop > 40) {
      navbar?.classList.add('is-sticky');
    }
    else {
      navbar?.classList.remove('is-sticky');
    }

    // Top Btn Set
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
      (document.getElementById("back-to-top") as HTMLElement).style.display = "block"
    } else {
      (document.getElementById("back-to-top") as HTMLElement).style.display = "none"
    }
  }


  // When the user clicks on the button, scroll to the top of the document
  topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }


}
