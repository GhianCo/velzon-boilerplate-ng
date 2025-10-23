import {Routes} from '@angular/router';
import {GoogleComponent} from "./google/google.component";
import {LeafletComponent} from "./leaflet/leaflet.component";

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
