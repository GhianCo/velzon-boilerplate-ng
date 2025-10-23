import { Component, OnInit } from '@angular/core';

import {clientLogoModel} from './client-logo.module';
import { ClientLogo } from './data';
import {SlickCarouselModule} from "ngx-slick-carousel";

@Component({
  selector: 'app-client-logo',
  templateUrl: './client-logo.component.html',
  styleUrls: ['./client-logo.component.scss'],
  imports: [
    SlickCarouselModule
  ],
  standalone: true
})

/**
 * ClientLogoComponent
 */
export class ClientLogoComponent implements OnInit {

  constructor() { }

  ClientLogo!: clientLogoModel[];

  ngOnInit(): void {
    /**
     * fetches data
     */
     this._fetchData();
  }

  /**
 * User grid data fetches
 */
   private _fetchData() {
    this.ClientLogo = ClientLogo;
  }

  /**
   * Swiper Responsive setting
   */
  public Responsive= {
    infinite: true,
    slidesToShow: 4,
    autoplay: true,
    dots: true,
    arrows: false
  };

}
