import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {NgbModal, NgbNav, NgbNavItem, NgbNavOutlet, NgbRating, NgbTooltip} from '@ng-bootstrap/ng-bootstrap';
// Products Services
import { restApiService } from "../../../core/services/rest-api.service";
// Swiper Slider
import { SlickCarouselComponent, SlickCarouselModule } from 'ngx-slick-carousel';

import { productModel, productList } from '../product.model';
import {SimplebarAngularModule} from "simplebar-angular";
import {BreadcrumbsComponent} from "@shared/breadcrumbs/breadcrumbs.component";

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
  imports: [
    SimplebarAngularModule,
    BreadcrumbsComponent,
    SlickCarouselModule,
    NgbRating,
    NgbTooltip,
    NgbNav,
    NgbNavItem,
    NgbNavOutlet
  ],
  standalone: true
})

/**
 * ProductDetail Component
 */
export class ProductDetailComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  public productDetail!: productModel[];
  isImage;
  defaultSelect = 2;
  readonly = false;
  content?: any;
  products: any;

  /**
 * Swiper setting
 */
  config = {
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    arrows: false
  };

  slidesConfig = {
    // Configuration options for the ngx-slick-carousel
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
  }

  @ViewChild('slickModal') slickModal!: SlickCarouselComponent;

  constructor(private route: ActivatedRoute, private modalService: NgbModal, public restApiService: restApiService) {
    this.products = this.route.snapshot.params
    this.route.params.subscribe(params =>
      this.productDetail = productList.filter(function (product) {
        return product.id == parseInt(params['any'])
      })
    );
    this.isImage = this.productDetail[0].images[0];
  }

  ngOnInit(): void {
    /**
   * BreadCrumb
   */
    this.breadCrumbItems = [
      { label: 'Ecommerce' },
      { label: 'Product Details', active: true }
    ];
  }

  slickChange(event: any) {
    const swiper = document.querySelectorAll('.swiperlist')
  }

  slidePreview(id: any, event: any) {
    const swiper = document.querySelectorAll('.swiperlist')
    swiper.forEach((el: any) => {
      el.classList.remove('swiper-slide-thumb-active')
    })
    event.target.closest('.swiperlist').classList.add('swiper-slide-thumb-active')
    this.slickModal.slickGoTo(id)
  }
}

