import { Component, OnInit } from '@angular/core';
import {ScrollspyDirective} from "@shared/scrollspy.directive";
import {RouterLink} from "@angular/router";
import {NgbCollapse} from "@ng-bootstrap/ng-bootstrap";
import {NgClass} from "@angular/common";
import {WalletComponent} from "@app/pages/crypto/wallet/wallet.component";
import {MarketPlaceComponent} from "@shared/landing/nft/market-place/market-place.component";
import {FeaturesComponent} from "@shared/landing/nft/features/features.component";
import {CategoriesComponent} from "@shared/landing/nft/categories/categories.component";
import {DiscoverComponent} from "@shared/landing/nft/discover/discover.component";
import {TopCreatorComponent} from "@shared/landing/nft/top-creator/top-creator.component";
import {FooterComponent} from "@app/layouts/footer/footer.component";

@Component({
  selector: 'app-nft',
  templateUrl: './nft.component.html',
  styleUrls: ['./nft.component.scss'],
  imports: [
    ScrollspyDirective,
    RouterLink,
    NgbCollapse,
    NgClass,
    WalletComponent,
    MarketPlaceComponent,
    FeaturesComponent,
    CategoriesComponent,
    DiscoverComponent,
    TopCreatorComponent,
    FooterComponent
  ],
  standalone: true
})

/**
 * Nft Component
 */
export class NftComponent implements OnInit {

  currentSection:string = '';
  public isCollapsed = true;

  constructor() { }

  ngOnInit(): void {
    this.scrollTo('hero');
  }

  ngAfterViewInit() {
    // this.scrollTo('hero');
  }

  ngOnDestroy(){
    // this.scrollTo('hero');
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

  /**
  * Section changed method
  * @param sectionId specify the current sectionID
  */
  onSectionChange(sectionId: string) {
    this.currentSection = '';
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
