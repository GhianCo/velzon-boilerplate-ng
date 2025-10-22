import {Routes} from '@angular/router';

import {MaintenanceComponent} from "@app/extraspages/maintenance/maintenance.component";
import {ComingSoonComponent} from "@app/extraspages/coming-soon/coming-soon.component";

export default [
  {
    path: "maintenance",
    component:MaintenanceComponent
  },
  {
    path: "coming-soon",
    component:ComingSoonComponent
  }
] as Routes;
