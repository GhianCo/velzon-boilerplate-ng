import {Routes} from '@angular/router';
import {GoogleComponent} from "@app/pages/maps/google/google.component";
import {LeafletComponent} from "@app/pages/maps/leaflet/leaflet.component";

export default [
  {
    path: 'google',
    component: GoogleComponent
  },
  {
    path: 'leaflet',
    component: LeafletComponent
  }
] as Routes;
