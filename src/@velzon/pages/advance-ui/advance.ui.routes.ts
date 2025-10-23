import {Routes} from '@angular/router';

import {SweetalertsComponent} from "./sweetalerts/sweetalerts.component";
import {ScrollbarComponent} from "./scrollbar/scrollbar.component";
import {TourComponent} from "./tour/tour.component";
import {SwipersComponent} from "./swiper/swiper.component";
import {RatingsComponent} from "./ratings/ratings.component";
import {HighlightComponent} from "./highlight/highlight.component";
import {ScrollspyComponent} from "./scrollspy/scrollspy.component";

export default [
  {
    path: "sweetalerts",
    component: SweetalertsComponent
  },
  {
    path: "scrollbar",
    component: ScrollbarComponent
  },
  {
    path: "tour",
    component: TourComponent
  },
  {
    path: "swiper",
    component: SwipersComponent
  },
  {
    path: "ratings",
    component: RatingsComponent
  },
  {
    path: "highlight",
    component: HighlightComponent
  },
  {
    path: "scrollspy",
    component: ScrollspyComponent
  }
] as Routes;
