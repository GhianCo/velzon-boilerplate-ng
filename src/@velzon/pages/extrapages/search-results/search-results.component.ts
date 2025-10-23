import { Component, OnInit } from '@angular/core';

// Light Box
import {Lightbox, LightboxModule} from 'ngx-lightbox';

import { swiperModel, GalleryModel, NewsModel, VideoModel } from './search-results.model';
import { gallery, news, swiper, video } from '@velzon/core/data';
import {BreadcrumbsComponent} from "../../../components/breadcrumbs/breadcrumbs.component";
import {NgbDropdown, NgbNav, NgbNavContent, NgbNavItem, NgbNavLink, NgbNavOutlet} from "@ng-bootstrap/ng-bootstrap";
import {NgClass} from "@angular/common";
import {SlickCarouselModule} from "ngx-slick-carousel";

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss'],
  imports: [
    BreadcrumbsComponent,
    NgbNav,
    NgbNavItem,
    NgbNavLink,
    NgClass,
    LightboxModule,
    SlickCarouselModule,
    NgbNavContent,
    NgbDropdown,
    NgbNavOutlet
  ],
  standalone: true
})

/**
 * SearchResults Component
 */
export class SearchResultsComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  swiper!: swiperModel[];
  gallery!: GalleryModel[];
  news!: NewsModel[];
  video!: VideoModel[];

  images: { src: string; thumb: string; caption: string }[] = [];

  constructor(private lightbox: Lightbox) {
    for (let i = 1; i <= 5; i++) {
      const src = 'assets/images/small/img-' + i + '.jpg';
      const caption = 'Image ' + i + ' caption here';
      const thumb = '../../../../assets/images/small/img-' + i + '-thumb.jpg';
      const item = {
        src: src,
        caption: caption,
        thumb: thumb
      };
      this.images.push(item);
    }
  }

  ngOnInit(): void {
    /**
    * BreadCrumb
    */
    this.breadCrumbItems = [
      { label: 'Pages' },
      { label: 'Search Results', active: true }
    ];

    // Chat Data Get Function
    this._fetchData();
  }

  // Chat Data Fetch
  private _fetchData() {
    this.swiper = swiper;
    this.gallery = gallery;
    this.news = news;
    this.video = video;

    setTimeout(() => {
      this.slideConfig = {
        infinite: true,
        slidesToShow: 6,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 100,
        arrows: false
      };
    }, 0);
  }


  open(index: number): void {
    // open lightbox
    this.lightbox.open(this.images, index, {});
  }

  /**
   * Swiper setting
   */
  slideConfig = {
    infinite: true,
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 100,
    arrows: false
  };


}
