import {Component, OnInit, ViewChild, Input, Inject, PLATFORM_ID, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {BreadcrumbsComponent} from "@shared/breadcrumbs/breadcrumbs.component";
import {GoogleMap, MapMarker} from "@angular/google-maps";

interface MarkerProperties {
  position: {
    lat: number;
    lng: number;
  }
};

@Component({
  selector: 'app-google',
  templateUrl: './google.component.html',
  styleUrls: ['./google.component.scss'],
  imports: [
    BreadcrumbsComponent,
    GoogleMap,
    MapMarker
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  standalone: true
})

/**
 * Google Maps Component
 */
export class GoogleComponent implements OnInit {

  // bread crumb items
  breadCrumbItems!: Array<{}>;
  longitude = 20.728218;
  latitude = 52.128973;
  zoom: number = 15;
  @ViewChild('streetviewMap', { static: true }) streetviewMap: any;
  @ViewChild('streetviewPano', { static: true }) streetviewPano: any;

  constructor(@Inject(PLATFORM_ID) private platformId: any) { }

  ngOnInit(): void {
    /**
    * BreadCrumb
    */
    this.breadCrumbItems = [
      { label: 'Maps' },
      { label: 'Google Maps', active: true }
    ];
  }

  mapOptions: google.maps.MapOptions = {
    center: { lat: 48.8588548, lng: 2.347035 },
    zoom: 13,
  };

  markers: MarkerProperties[] = [
    { position: { lat: 48.8584, lng: 2.2945 } }, // Eiffel Tower
    { position: { lat: 48.8606, lng: 2.3376 } }, // Louvre Museum
    { position: { lat: 48.8530, lng: 2.3499 } }, // Cathédrale Notre-Dame de Paris
  ];

}
