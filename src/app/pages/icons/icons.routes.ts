import {Routes} from '@angular/router';
import {RemixComponent} from "@app/pages/icons/remix/remix.component";
import {BoxiconsComponent} from "@app/pages/icons/boxicons/boxicons.component";
import {MaterialdesignComponent} from "@app/pages/icons/materialdesign/materialdesign.component";
import {FeatherComponent} from "@app/pages/icons/feather/feather.component";
import {LineawesomeComponent} from "@app/pages/icons/lineawesome/lineawesome.component";
import {IconsCryptoComponent} from "@app/pages/icons/icons-crypto/icons-crypto.component";

export default [
  {
    path: 'remix',
    component: RemixComponent
  },
  {
    path: 'boxicons',
    component: BoxiconsComponent
  },
  {
    path: 'materialdesign',
    component: MaterialdesignComponent
  },
  {
    path: 'feather',
    component: FeatherComponent
  },
  {
    path: 'lineawesome',
    component: LineawesomeComponent
  },
  {
    path: "icons-crypto",
    component: IconsCryptoComponent
  }
] as Routes;
