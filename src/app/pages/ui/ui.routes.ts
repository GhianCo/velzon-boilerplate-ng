import {Routes} from '@angular/router';
import {AlertsComponent} from "@app/pages/ui/alerts/alerts.component";
import {BadgesComponent} from "@app/pages/ui/badges/badges.component";
import {ButtonsComponent} from "@app/pages/ui/buttons/buttons.component";
import {CardsComponent} from "@app/pages/ui/cards/cards.component";
import {CarouselComponent} from "@app/pages/ui/carousel/carousel.component";
import {DropdownsComponent} from "@app/pages/ui/dropdowns/dropdowns.component";
import {GridComponent} from "@app/pages/ui/grid/grid.component";
import {ImagesComponent} from "@app/pages/ui/images/images.component";
import {TabsComponent} from "@app/pages/ui/tabs/tabs.component";
import {ColorsComponent} from "@app/pages/ui/colors/colors.component";
import {AccordionsComponent} from "@app/pages/ui/accordions/accordions.component";
import {ModalsComponent} from "@app/pages/ui/modals/modals.component";
import {PlaceholderComponent} from "@app/pages/ui/placeholder/placeholder.component";
import {ProgressComponent} from "@app/pages/ui/progress/progress.component";
import {NotificationsComponent} from "@app/pages/ui/notifications/notifications.component";
import {MediaComponent} from "@app/pages/ui/media/media.component";
import {VideoComponent} from "@app/pages/ui/video/video.component";
import {TypographyComponent} from "@app/pages/ui/typography/typography.component";
import {ListComponent} from "@app/pages/ui/list/list.component";
import {GeneralComponent} from "@app/pages/ui/general/general.component";
import {UtilitiesComponent} from "@app/pages/ui/utilities/utilities.component";
import {LinksComponent} from "@app/pages/ui/links/links.component";
import {RibbonsComponent} from "@app/pages/ui/ribbons/ribbons.component";

export default [
  {
    path: 'alerts',
    component: AlertsComponent
  },
  {
    path: 'badges',
    component: BadgesComponent
  },
  {
    path: 'buttons',
    component: ButtonsComponent
  },
  {
    path: 'cards',
    component: CardsComponent
  },
  {
    path: 'carousel',
    component: CarouselComponent
  },
  {
    path: 'dropdowns',
    component: DropdownsComponent
  },
  {
    path: 'grid',
    component: GridComponent
  },
  {
    path: 'images',
    component: ImagesComponent
  },
  {
    path: 'tabs',
    component: TabsComponent
  },
  {
    path: 'colors',
    component: ColorsComponent
  },
  {
    path: 'accordions',
    component: AccordionsComponent
  },
  {
    path: 'modals',
    component: ModalsComponent
  },
  {
    path: 'placeholder',
    component: PlaceholderComponent
  }, {
    path: 'progress',
    component: ProgressComponent
  },
  {
    path: 'notifications',
    component: NotificationsComponent
  },
  {
    path: 'media',
    component: MediaComponent
  },
  {
    path: 'video',
    component: VideoComponent
  },
  {
    path: 'typography',
    component: TypographyComponent
  },
  {
    path: 'list',
    component: ListComponent
  },
  {
    path: 'general',
    component: GeneralComponent
  },
  {
    path: 'ribbons',
    component: RibbonsComponent
  },
  {
    path: 'utilities',
    component: UtilitiesComponent
  },
  {
    path: 'links',
    component: LinksComponent
  },
] as Routes;
