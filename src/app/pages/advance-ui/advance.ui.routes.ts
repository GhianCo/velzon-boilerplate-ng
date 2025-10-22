import {Routes} from '@angular/router';

import {SweetalertsComponent} from "@app/pages/advance-ui/sweetalerts/sweetalerts.component";
import {ScrollbarComponent} from "@app/pages/advance-ui/scrollbar/scrollbar.component";
import {TourComponent} from "@app/pages/advance-ui/tour/tour.component";
import {SwipersComponent} from "@app/pages/advance-ui/swiper/swiper.component";
import {RatingsComponent} from "@app/pages/advance-ui/ratings/ratings.component";
import {HighlightComponent} from "@app/pages/advance-ui/highlight/highlight.component";
import {ScrollspyComponent} from "@app/pages/advance-ui/scrollspy/scrollspy.component";

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
