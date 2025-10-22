import { Component, OnInit } from '@angular/core';
import {FooterComponent} from "@app/layouts/footer/footer.component";
import {ClientLogoComponent} from "@shared/landing/index/client-logo/client-logo.component";
import {ServicesComponent} from "@shared/landing/index/services/services.component";
import {CollectionComponent} from "@shared/landing/index/collection/collection.component";
import {CtaComponent} from "@shared/landing/index/cta/cta.component";
import {DesignedComponent} from "@shared/landing/index/designed/designed.component";
import {PlanComponent} from "@shared/landing/index/plan/plan.component";
import {FaqsComponent} from "@app/pages/extrapages/faqs/faqs.component";
import {ReviewComponent} from "@shared/landing/index/review/review.component";
import {CounterComponent} from "@shared/landing/index/counter/counter.component";
import {WorkProcessComponent} from "@shared/landing/index/work-process/work-process.component";
import {TeamComponent} from "@app/pages/extrapages/team/team.component";
import {ContactComponent} from "@shared/landing/index/contact/contact.component";
import {RouterLink} from "@angular/router";
import {NgbCarousel, NgbSlide} from "@ng-bootstrap/ng-bootstrap";
import {NgClass} from "@angular/common";
import {ScrollspyDirective} from "@shared/scrollspy.directive";

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
  imports: [
    FooterComponent,
    ClientLogoComponent,
    ServicesComponent,
    CollectionComponent,
    CtaComponent,
    DesignedComponent,
    PlanComponent,
    FaqsComponent,
    ReviewComponent,
    CounterComponent,
    WorkProcessComponent,
    TeamComponent,
    ContactComponent,
    RouterLink,
    NgbCarousel,
    NgClass,
    ScrollspyDirective,
    NgbSlide
  ],
  standalone: true
})

/**
 * Index Component
 */
export class IndexComponent implements OnInit {

  currentSection = 'hero';
  showNavigationArrows: any;
  showNavigationIndicators: any;

  constructor() { }

  ngOnInit(): void {}

  // ngAfterViewInit() {
  //   this.scrollTo('hero');
  // }

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

   /**
   * Section changed method
   * @param sectionId specify the current sectionID
   */
    onSectionChange(sectionId: string) {
      this.currentSection = sectionId;
    }

  /**
   * Toggle navbar
   */
  toggleMenu() {
    document.getElementById('navbarSupportedContent')?.classList.toggle('show');
  }

  // When the user clicks on the button, scroll to the top of the document
  topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

}
