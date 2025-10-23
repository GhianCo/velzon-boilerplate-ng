import {Routes} from '@angular/router';
import {RemixComponent} from "./remix/remix.component";
import {BoxiconsComponent} from "./boxicons/boxicons.component";
import {MaterialdesignComponent} from "./materialdesign/materialdesign.component";
import {FeatherComponent} from "./feather/feather.component";
import {LineawesomeComponent} from "./lineawesome/lineawesome.component";
import {IconsCryptoComponent} from "./icons-crypto/icons-crypto.component";

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
